import { loadTdsData } from "./data/dataTranslator.js";
import { classes, el, TooltipIds, TooTipIdsStr, ToolTipIdDict } from "./ui/const.js";
import { initializeFilters, selectionsCompleted, showFilters, getFilteredTdsData, setDefaultChemicalGroup  } from "./ui/filter.js";
import { displayGraph } from "./ui/graphComponent.js";
import { addEventListenersToPage, initializePageText, resetPage } from "./ui/page.js";
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

        const selectedHeader = d3.select(".navBarContainer .nav-item .nav-link.active");
        this.onHeaderClick(selectedHeader);

        // add the listner for clicking on the tooltip
        window.addEventListener("click", (event) => { this.toggleToolTip(event) });
    }

    // setupHeader(): Setup the header needed for the app
    setupHeader() {
        const self = this;
        d3.selectAll(".navBarContainer .nav-item .nav-link")
            .on("click", (event, data) => {
                let selectedHeader = event.target;
                if (selectedHeader.nodeName == "DIV") {
                    selectedHeader = selectedHeader.parentElement;
                }

                selectedHeader = d3.select(selectedHeader);
                this.onHeaderClick(selectedHeader, data);
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

    // onHeaderClick(selectedHeader, data): Listner for when the header is clicked
    onHeaderClick(selectedHeader, data = undefined) {
        const activeHeader = d3.select(".navBarContainer .nav-item .nav-link.active");

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

        const page = selectedHeader.attr("value");
        const graphType = page;
        this.activePage = page;

        graphFilterContainers.forEach((filter) => {
            filter.classList.remove(classes.FILTER_ADDITIONAL_ACTIVE);
        });

        graphSelects.forEach((element) => {
            element.classList.remove(classes.ACTIVE_GRAPH_SELECT);
        });

        selectedHeader.classed(classes.ACTIVE_GRAPH_SELECT, true);

        el.graphs[graphType].filterContainers.forEach((container) => {
            if (!container.classList.contains(classes.FILTER_ADDITIONAL_ACTIVE)) {
                container.classList.add(classes.FILTER_ADDITIONAL_ACTIVE);
            }
        });

        this.setSelectedOpt(selectedHeader, activeHeader, data, (selectedOpt, data) => {
            this.loadMainPage();
        });
    }

    // setNavOptActive(element): Makes some option to be selected
    setNavOptActive(element) {
        element.classed("active", true);
        element.attr("aria-current", "page"); // for assessibility
    }

    // setNavOptInactive(element): Makes some option to be unselected
    setNavOptInactive(element) {
        element.classed("active", false);
        element.attr("aria-current", null); // for assessibility
    }

    // loadMainPage(): Loads the main content for a particular page
    loadMainPage() {
        if (!selectionsCompleted()) return;

        if (this.activePage == GraphTypes.RBFG) {
            const toolTipId = ToolTipIdDict.title;
            this.removeToolTips(`#${toolTipId}`)

            const toolTipElements = d3.selectAll([el.graphs.titleContainer]);
            const toolTipTextFunc = (data) => { return Translation.translateWebNotes(`graphs.${GraphTypes.RBFG}.titleInfo`); };

            this.drawToolTips(ToolTipIdDict.title, toolTipElements, toolTipTextFunc);
        }

        showFilters();
        displayGraph(getFilteredTdsData());
    }

    // setSelectedOpt(selectedOpt, activeOpt, data, onSelected): Sets the selected option to be
    //  active and disables the previous selected option
    setSelectedOpt(selectedOpt, activeOpt, data, onSelected) {
        if (data === undefined) {
            data = selectedOpt.attr("value");
        }

        this.setNavOptInactive(activeOpt);
        this.setNavOptActive(selectedOpt);
        onSelected(selectedOpt, data);
    }

    // Changes the language registered on the website
    changeLanguage(newLanguage) {
        const website = d3.select("html");
        website.attr("lang", newLanguage);
        Translation.changeLanguage(newLanguage);
        this.lang = newLanguage;

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

    // drawToolTips(toolTipId, elementsWithInfoIcons, toolTipTextFunc): Draws the tooltips
    drawToolTips(toolTipId, elementsWithInfoIcons, toolTipTextFunc = undefined) {
        // ----------- draw the tool tips ---------------
        
        const infoIconGroups = elementsWithInfoIcons.append("span");
        const icons = infoIconGroups.append("i")
            .attr("class", "fa fa-info-circle infoIcon")
            .attr("aria-hidden", true); // used for accessibility purposes

        if (toolTipTextFunc == undefined) {
            toolTipTextFunc = (data) => { return data; };
        }

        icons.attr("id", toolTipId)
            .attr("title", toolTipTextFunc)
            .attr("data-bs-html", "true")
            .attr("data-toggle", "tooltip")
            .attr("data-placement", "right")
            .each((data, index, elements) => { $(elements[index]).tooltip({placement: "right", container: "body", trigger: "manual"}); })

            // rewrite the title again since creating a Bootstrap tooltip will set the 'title' attribute to null
            //   and transfer the content of the 'title' attribute to a new attribute called 'data-bs-original-title'
            //
            // Comment out the line below if we want to add back the title attribute.
            // Its used for the hover text of the icon, but the user can see the same text if they click the icon
            //
            // The 'title' attribute seems to be for some assessbility purposes
            // https://fontawesome.com/v5/docs/web/other-topics/accessibility
            //
            // .attr("title", toolTipTextFunc);

        // add the hidden text needed for screen readers
        for (const element of icons._groups[0]) {
            d3.select(element.parentNode).append("span")
                .classed("sr-only", true)
                .text(toolTipTextFunc);
        }

        icons.on("mouseenter", (event) => { 
            this.infoIconOnHover(event.target)
        });
        icons.on("mouseleave", (event) => { this.infoIconUnHover(event.target)});

        // ----------------------------------------------
    }

    // removeToolTips(toolTipSelector): Removes the tooltips
    removeToolTips(toolTipSelector) {
        const toolTips = d3.selectAll(toolTipSelector);
        toolTips.each((data, index, elements) => { $(elements[index]).tooltip('dispose'); });
        toolTips.remove();
    }

    // infoIconHover(element): When the info icon is being hovered over
    infoIconOnHover(element) {
        element = d3.select(element);
        element.classed("infoIcon-enabled", true);
        element.classed("infoIcon-disabled", false);
    }

    // infoIconUnHover(element): when the info icon is unhovered
    infoIconUnHover(element) {
        element = d3.select(element);

        // do not change back the color if the icon has already been clicked
        if (element.attr("infoIconClicked") == null) {
            element.classed("infoIcon-enabled", false);
            element.classed("infoIcon-disabled", true);
        }
    }

    // toggleToolTip(icon): Toggles the tooltip to either show/hide
    toggleToolTip(event) {
        const classNames = event.target.className.split(" ");
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
  el.misc.loader.classList.remove(classes.HIDDEN);
  await initializePageText();
  await loadTdsData();
  addEventListenersToPage();
  initializeFilters();
  el.misc.loader.classList.add(classes.HIDDEN);
}


let app = new App();

app.init();
Promise.all([main()]).then(() => {
    app.loadMainPage();
});
