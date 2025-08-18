import { loadTdsData } from "./data/dataTranslator.js";
import { classes, el, TooltipIds, TooTipIdsStr, ToolTipIdDict } from "./ui/const.js";
import { initializeFilters, selectionsCompleted, showFilters, getFilteredTdsData, FilteredFoodGroups  } from "./ui/filter.js";
import { displayGraph } from "./ui/graphComponent.js";
import { addEventListenersToPage, initializePageText, resetPage, showLoadingPage, hideLoadingPage } from "./ui/page.js";
import { ThemeNames, DefaultTheme, userLanguage, Translation, Themes, DefaultPage, GraphTypes } from "./const.js";



// App: The class for the overall application
class App {
    constructor() {
        this.lang = userLanguage;
        this.theme = DefaultTheme;
        this.activePage = DefaultPage;

        // the clicked info icon
        this.clickedIcon = undefined;
    }

    // init(page): Initializes the entire app
    async init(page = undefined) {
        const self = this;
        this.changeLanguage(self.lang);

        // setup the header
        this.setupHeader();

        // global theme variables
        this.themeVars = document.querySelector(':root');
        this.setTheme();

        const selectedGraphOpt = d3.select(".graph-select.active");
        this.onGraphOptClick(selectedGraphOpt);

        // add the listner for clicking on the tooltip
        window.addEventListener("click", (event) => { this.toggleToolTip(event) });
    }

    // setupHeader(): Setup the header needed for the app
    setupHeader() {
        const self = this;
        d3.selectAll(".graph-select")
            .on("click", (event, data) => {
                let selectedGraphOpt = event.target;
                if (selectedGraphOpt.nodeName == "IMG") {
                    selectedGraphOpt = selectedGraphOpt.parentElement;
                }

                selectedGraphOpt = d3.select(selectedGraphOpt);
                this.onGraphOptClick(selectedGraphOpt, data);
            });

        // register the link to change the language
        this.headerLink = d3.select(".headerOption:last-child");
        this.headerLink.attr("value", Translation.translate("changeLanguageValue"));

        this.headerLink.on("click", (event) => this.onLanguageChange());

        this.themeDropdown = d3.select("#themeDropdownMenu");

        // add the different options for the theme
        const themeOptions = this.themeDropdown
            .selectAll("li")
            .data(Object.values(ThemeNames))
            .enter()
            .append("li")
            .append("a")
            .attr("class", "dropdown-item themeDropdownItem")
            .attr("href", "#")
            .on("click", (event, theme) => {
                const selectedThemeLink = d3.select(event.target);
                const activeThemeLink = this.themeDropdown.select(".themeDropdownItem.active");

                self.setNavOptInactive(activeThemeLink);
                self.setNavOptActive(selectedThemeLink);

                self.theme = theme;
                self.setTheme();
            });
            
        // set the different options for the theme to be active
        themeOptions.each((theme, ind, elements) => {
            const element = d3.select(elements[ind]);
            if (theme == self.theme) {
                self.setNavOptActive(element);
                return;
            }

            self.setNavOptInactive(element);
        });

        self.updateHeaderText();
    }

    // onGraphOptClick(selectedHeader, data): Listener for when a graph choice is clicked
    onGraphOptClick(selectedGraphOpt, data = undefined) {
        const activeGraphOpt = d3.select(".graph-select.active");

        const graphSelects = [
            el.graphs[GraphTypes.RBASG].graphSelect,
            el.graphs[GraphTypes.RBF].graphSelect,
            el.graphs[GraphTypes.RBFG].graphSelect,
        ];

        const graphFilterContainers = [
            ...el.graphs[GraphTypes.RBASG].filterContainers,
            ...el.graphs[GraphTypes.RBF].filterContainers,
            ...el.graphs[GraphTypes.RBFG].filterContainers,
        ]

        const page = selectedGraphOpt.attr("value");
        const graphType = page;
        this.activePage = page;

        graphFilterContainers.forEach((filter) => {
            filter.classList.remove(classes.FILTER_ADDITIONAL_ACTIVE);
        });

        graphSelects.forEach((element) => {
            element.classList.remove(classes.ACTIVE_GRAPH_SELECT);
        });

        selectedGraphOpt.classed(classes.ACTIVE_GRAPH_SELECT, true);

        el.graphs[graphType].filterContainers.forEach((container) => {
            if (!container.classList.contains(classes.FILTER_ADDITIONAL_ACTIVE)) {
                container.classList.add(classes.FILTER_ADDITIONAL_ACTIVE);
            }
        });

        this.setSelectedGraph(selectedGraphOpt, activeGraphOpt, data, (selectedOpt, data) => {
            this.loadMainPage();
        });
    }

    // setNavOptActive(element): Makes some option to be selected
    setNavOptActive(element) {
        element.classed("active", true);
    }

    // setGraphActive(element): Makes some graph choice to be selected
    setGraphActive(element) {
        this.setNavOptActive(element);
        element.classed(classes.ACTIVE_GRAPH_SELECT, true);
    }

    // setNavOptInactive(element): Makes some option to be unselected
    setNavOptInactive(element) {
        element.classed("active", false);
    }

    // setGraphOptInactive(element): Makes some graph choice to be inactive
    setGraphInactive(element) {
        this.setNavOptInactive(element);
        element.classed(classes.ACTIVE_GRAPH_SELECT, false);
    }

    // loadMainPage(): Loads the main content for a particular page
    loadMainPage() {
        if (!selectionsCompleted()) return;

        const toolTipId = ToolTipIdDict.title;
        this.removeToolTips(`#${toolTipId}`);

        showFilters();
        displayGraph(getFilteredTdsData());
    }

    // setSelectedGraph(selectedOpt, activeOpt, data, onSelected): Sets the selected graph choice to be
    //  active and disables the previous selected graph choice
    setSelectedGraph(selectedOpt, activeOpt, data, onSelected) {
        if (data === undefined) {
            data = selectedOpt.attr("value");
        }

        this.setGraphInactive(activeOpt);
        this.setGraphActive(selectedOpt);
        onSelected(selectedOpt, data);
    }

    // Changes the language registered on the website
    changeLanguage(newLanguage) {
        const website = d3.select("html");
        website.attr("lang", newLanguage);
        Translation.changeLanguage(newLanguage);
        this.lang = newLanguage;
        FilteredFoodGroups.clear();

        this.loadMainPage();
    }

    // setTheme(): Changes the colour for the theme selected
    setTheme() {
        const themeObj = Themes[this.theme];
        for (const themeKey in themeObj) {
            const themeColour = themeObj[themeKey];
            
            if (themeColour.constructor === Array) {
                themeColour.forEach((colour, ind) => {
                    this.themeVars.style.setProperty(`--${themeKey}${ind}`, colour);
                });
                continue;
            } 

            this.themeVars.style.setProperty(`--${themeKey}`, themeColour);
        }
    }

    // updateHeaderText(): Changes the text in the header based off the language
    updateHeaderText() {
        // metadata about the document
        document.title = Translation.translate("websiteTabTitle");
        document.querySelector('meta[name="description"]').setAttribute("content", Translation.translate("websiteDescriptions"));

        // link that changes the language
        this.headerLink.text(Translation.translate("changeLanguage"));
        this.headerLink.attr("value", Translation.translate("changeLanguageValue"));

        // navigation links
        const navLinks = d3.selectAll(".navBarContainer .nav-item .nav-link").nodes();
        for (const linkNode of navLinks) {
            const link = d3.select(linkNode);
            const linkTxt = link.select("div");
            const linkValue = link.attr("value");
            linkTxt.text(Translation.translate(`filters.graphSelects.${linkValue}`));
        }

        // theme names
        d3.selectAll(".themeDropdownItem")
            .text((themeValue) => { return Translation.translate(`themes.${themeValue}`); });
    }

    // onLanguageChange(): Listener when the language of the website changes
    async onLanguageChange() {
        const newLanguage = this.headerLink.attr("value");
        this.changeLanguage(newLanguage);

        this.updateHeaderText();

        Promise.all([resetPage()]).then(() => {
            this.loadMainPage();
        });
    }

    // removeToolTips(toolTipSelector): Removes the tooltips
    removeToolTips(toolTipSelector) {
        const toolTips = d3.selectAll(toolTipSelector);
        toolTips.each((data, index, elements) => { $(elements[index]).tooltip('dispose'); });
        toolTips.remove();
    }

    // toggleToolTip(icon): Toggles the tooltip to either show/hide
    toggleToolTip(event) {
        let classNames = event.target.className;

        try {
            classNames = classNames.split(" ");
        } catch (error) {
            classNames = [];
        }

        const isNotIcon = !TooltipIds.has(event.target.id);

        // clicking inside of the box of the tooltip
        if (classNames.includes(classes.NOTE_ELEMENT) || (isNotIcon && classNames.includes("tooltip-inner"))) return;

        // hide all the tooltips if clicking outside of the tooltip
        else if (isNotIcon) {
            $(TooTipIdsStr).tooltip("hide")
                .attr("infoIconClicked", null)
                .removeClass("infoIcon-enabled")
                .addClass("infoIcon-disabled");
            this.clickedIcon = undefined;
            return;
        }

        const hasClickedIcon = this.clickedIcon !== undefined;
        const icon = $(event.target);

        // hide the tooltip that was previously displayed on screen
        if (hasClickedIcon) {
            this.clickedIcon.tooltip("hide")
                .attr("infoIconClicked", null)
                .removeClass("infoIcon-enabled")
                .addClass("infoIcon-disabled");
        }

        if (hasClickedIcon && this.clickedIcon.attr("nutrient") == icon.attr("nutrient")) {
            this.clickedIcon = undefined;
            return;
        }

        // show the clicked tooltip
        icon.tooltip("show")
            .attr("infoIconClicked", "clicked")
            .removeClass("infoIcon-disabled")
            .addClass("infoIcon-enabled");
        this.clickedIcon = icon;
    }
}


async function main() {
  showLoadingPage();
  await initializePageText();
  await loadTdsData();
  addEventListenersToPage();
  initializeFilters();
  hideLoadingPage();
}


let app = new App();

app.init();
Promise.all([main()]).then(() => {
    app.loadMainPage();
});
