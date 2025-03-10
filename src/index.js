import { loadTdsData } from "./data/dataTranslator.js";
import { classes, el } from "./ui/const.js";
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
        if (selectionsCompleted()) {
            showFilters();
            displayGraph(getFilteredTdsData());
        }
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
        });;
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
