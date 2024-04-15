# Total Diet Study Dietary Exposure Tool

Health Canada's Total Diet Study has amassed extensive data on the consumption and contamination of food among Canadians. This data encompasses studies from various years, each targeting specific contaminants in particular foods, alongside statistics on food consumption among Canadians based on age-sex groups. The tool's primary purpose is to efficiently aggregate and calculate findings for this data, enabling visualizations for stakeholders.

At the core of the application are the user filters. Once users select their desired filters/modifications, calculations are executed and graphs are generated and displayed. Currently, three types of graphs are available: Results by Age-Sex Group (RBASG, a grouped bar chart), Results by Food Group (RBFG, a stacked bar chart), and Results by Food (RBF, a sunburst graph). Data tables accompany each graph, providing detailed calculations and findings, along with options to save the graph or download the involved data.

## Project Structure

At a high level, the project is structured as follows:
- Source code exists in the `src` folder.
- External libraries exist in the `lib` folder.
- Data (in the form of CSV files) is stored in the `data` folder, categorized by data type (consumption or contaminant).
- Any general-purpose scripts should be contained within a `bin` folder.
- Other static assets such as images and stylesheets exist in their own appropriately named folders.

The source code is organized in the following way:
- Logic for loading, downloading, or parsing TDS data is centralized within the `data` folder.
- All calculations and data manipulation for visualizations are housed in the `graph` folder. This includes logic for grouping data, performing calculations, and preparing data for display in tables and graphs.
- Translations are managed within the `translation` folder, utilizing a single object with keys for each language.
- Logic related to displaying page elements, filters, graphs, and tables is contained within the `ui` folder. This includes specific logic for graph creation within the nested graph folder, as well as event listeners for various page elements. All CSS classes and HTML elements used in the application are isolated and retrieved from the `const.js` file.
- Utility/helper methods related to data or graphs can be found in the `util` folder. These methods range from obtaining domain-specific values from raw TDS data to formatting values for display and generating color mappings.
The file `const.js` is a central location for all domain-specific constants and objects.

One of the primary objectives throughout the application development is to achieve loose coupling, enhancing resilience to change. For instance, the loading, translation, and display of visualizations are each encapsulated within distinct files, adhering to strict contracts. Additionally, the core logic of the application remains independent of any specific language, making it easier to change or introduce new features in the future.

### Data

The CSV files used by the application are from the following sources:
- Consumption Data: [TDS 2008-2022 Consumption Tables (CCHS 2015)](https://open.canada.ca/data/en/dataset/ac573724-2f77-4f75-a2f4-c416d79cf130). Includes the “TDS Composite Descriptions” file, which maps food composites to food groups and the “Daily intake per capita, per person” and “Daily intake per capita, in kg bodyweight” files for food consumption findings. The two files are identical but they store consumption findings in different units.
- Contaminant Occurrence Data (only data from the years 2008-2022 is used): [Trace Elements](https://open.canada.ca/data/en/dataset/83934503-cfae-4773-b258-e336896c2c53), [Radionuclides](https://open.canada.ca/data/en/dataset/062c769f-57d7-432e-9d33-1e333a87d6d0), [Bisphenol A (BPA)](https://open.canada.ca/data/en/dataset/0497695c-dd4c-42d6-8201-45d63509f416), [Polychlorinated biphenyls (PCBs)](https://open.canada.ca/data/en/dataset/b8e42fb0-98fe-4c99-935c-4c36221b1ee6), [DEHA, DEHP and other Phthalates](https://open.canada.ca/data/en/dataset/e52388ed-fb02-4292-b79c-b2f564ec1945), [Volatile Organic Chemicals (VOC)](https://open.canada.ca/data/en/dataset/66cc9542-bc08-46c9-8ebb-805d34f0e30e), [Ochratoxin A (OTA)](https://open.canada.ca/data/en/dataset/71fa9c90-f690-4928-9239-69b4ecbeccee).

### Graphs

For each graph, similiar steps for calculations are performed. The data is filtered and/or grouped by chemical group, chemical, age-sex group, etc. The dietary exposure estimate is calculated for each grouping by calculating the mean of all contaminant occurence values in the grouping, and multiplying by the mean consumption for a given age-sex group $\frac{ng}{g} * \frac{g}{person/day} = \frac{ng}{person/day}$.

#### Results by Age-Sex Group (RBASG)

A grouped bar graph that displays the total dietary exposure for the selected age-sex group(s). This graph can take two possible forms, one is to show results by age-sex group, and the other, by year. Displaying by age-sex takes the mean of the occurrence data for the selected year(s) and displays results for the selected age-sex groups from a multi-select list. Displaying by year uses the occurrence data each individual year and shows the changes in total exposure over time for a single age-sex group. 

#### Results by Food Group (RBFG)

A stacked bar chart showing the percent contribution of each food group to the total dietary exposure for each age-sex group. This visualization has the ability to display exposures in either percentages or absolute values, and it shows results only for the selected age-sex groups from the multi-select list. 

#### Results by Food (RBF)

A sunburst graph showing the percent contribution of each food to the total exposure for a specific age-sex group. The visualization calculates the mean occurrence for each food composite for the selected chemical and year(s), the dietary exposure from each food composite, and lastly the percent dietary exposure for each food composite for display.

### Translations

To ensure the application is available in both English and French, additional attention must be given to its design. 

All text visible to users should be dynamically loaded from the `translations.js` file; no hardcoded text should exist in any HTML or frontend code. This file contains a translations object with keys corresponding to supported languages. Within each language key, there are nested keys representing different parts of the application interface, with their values being the translated text. 

All data flowing in and out (loaded from data files and displayed to user) of the application code should be translated to and from domain objects, respectively. In this way, the application code is always operating on language-agnostic constants. Throughout the code, methods exist which utilize these constants, defined in `const.js`, to ensure consistent handling of translations. For example, see the `util/` folder.

### Libraries

Two libraries are used in the application:
- [D3](https://d3js.org/), for creating graphs/visualizations.
- [html2canvas](https://html2canvas.hertzen.com/documentation), for the save-graph feature.

## Deployment

GitHub Pages is used to seamlessly host the static application. With each push to the main branch, an automated deployment action is triggered, updating the application at https://bfssi-bioinformatics-lab.github.io/tds-dietary-exposure-tool. Configuration for GitHub Pages is managed through the Pages tab within the project settings on GitHub.

For local development, execute `./bin/run-local.sh` to initiate the application on localhost:8888. This script is essential for correctly serving static data files (CSVs).

If protected data is added to the application, the hosting of the application must be moved over to HRE. In such case a GitHub repository should still be maintained for local development, and its code and can be pulled down to a HC laptop, and pushed to a new repository on a HC GitLab server for deployment.