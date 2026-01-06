# Fractal Modular pattern 

### Modular Pattern

Since the basic structure of React is modular, it is recommended that the basis of our architecture also conforms to the modular design pattern. in such a way that, each part of the code that has an independent concept and meaning should try to have all its requirements in its own packaging.

### Fractal Pattern

the fractal pattern means that larger pieces are formed from repeated smaller ones, which generally have a similar structure.

![fractal-pattern.png](./assets/fractal-pattern.png)

### special advantage

he combination of the two modular and fractal patterns allows us to have regular and structured structures while having high flexibility. In most patterns, only one of these two is correctly realized and the possibility of having these two at the same time is the special advantage of this combined pattern.

&nbsp;

## fractal entities

In this combined pattern, a number of names are reserved for files and directories and specific concepts are assigned to them, which we call fractal entities.

### 1) Usage restrictions

The fractal directory and files are reserved in the project, meaning that these names should not be used with any other purpose or meaning in the project, and if an exception occurs, you should explain it in the main project documentation.

### 2) Polymorphism

Each fractal entity can be a file or a directory with the same name, containing a list of other custom and fractal files, depending on the complexity of the content.

For example, the reserved name “utils“ is chosen as the name of “/utils “ directory when we have a number of files separated, and when we have a few simple utility functions, it becomes the name of “utils.ts” file in which these functions are located.

### 3) List of Fractal Entities

Pay attention to the capitalization of the letters. 

1. **lib** 

    In this directory, any **JavaScript entity** can deal with React components and hooks. This directory can also be used as a wrapper for fractal entities such as configs, i18n, stores, etc. 

2. **configs** 

    Module **settings** are placed in this entity. Such as font setup, theme setup, user authentication actions, etc. 

3. **i18n** 

    Location of the definition of the **internationalization** dictionaries (translations) and its other requirements. 

4. **stores** 

    It includes the definition of **state management** (Zustand, React Context, etc.) and its side structures. 

5. **utils** 

    **Utility functions** and side operations (actions) are placed in this section. 

6. **hooks**

    **React hooks** are placed in this section.

7. **Components** 
   Components are always defined as directories and contain React components that have been separated from the main component body for readability or reuse.

    Exception: If this directory is defined at the root of the project, it is subject to these rules: By default, it contains 4 reserved wrapper directories and components should never be defined directly at the root of this directory. If it is not possible to categorize these 4 reserved ones, a custom wrapper can be defined and added to this document.

    **React components are placed in ~/Components**
    - **Layout**

        Components connected to layout.tsx files in ~/app.

    - **Error** 

        Components linked to error.tsx files in ~/app. 

    - **Shadcn** 

        Where to install **'shadcn'** components.

    - **Entity** 

        These components are often large and can also be published as a standalone npm package.

    - **Common** 

        All custom components of the project that are or can be used at different levels and points of the project.

8. **docs**

    **Documentation** and help descriptions for a module are defined in this entity.

9. **constants**

    In this section, you can place **constants, static data** and **placeholders data**.

10. **types**

    **TypeScript** types are defined in this section, but related items such as **zod** utilities, **data validators**, and **data schema** can also be placed here.

11. **api**

    In this place, items related to **API services** such as API address lists, **Axios interceptors**, **API management** and **data transpilers**, and the like should be defined.

12. **assets**

    Static files such as SVG images and lottie animations, font files, etc. are defined here.

13. **routes**

    Any structure that is somehow **related to routing** can be placed here, such as the list of project routes used in the href of Link components.

14. **query**

    Centralized **TanStack Query client configuration** (e.g. `client.ts`, `QueryProvider.tsx`) and any shared query utilities such as cache key helpers or hydration adapters. This entity encapsulates cross-cutting concerns of data fetching (client instance defaults, devtools exposure) separate from raw service access logic found in **api**.

15. **query**

    Centralized **TanStack Query client configuration** (e.g. `client.ts`, `QueryProvider.tsx`) and any shared query utilities such as cache key helpers or hydration adapters. This entity encapsulates cross-cutting concerns of data fetching (client instance defaults, devtools exposure) separate from raw service access logic found in **api**.

&nbsp;

## Non-fractal entities

Non-fractal entities are file and directory names that are defined for a specific location in the project and do not participate in the fractal process.

It is better not to use these names in other parts of the project, but if used, it will not follow the defined concept.

Also, the type of these entities is fixed and they do not have the Polymorphism property.

In non-fractal directories, modular and fractal structures can be defined, but before that, the guidelines and concepts set for it must be followed.

1. **/Main**
   This **directory** is where the **main body of the project** is defined and is directly **related to routing**, and each route has an equivalent directory here in a comprehensible way (not necessarily point-to-point).
   &nbsp;
   For example, if in NextJs App router we define the file _"~/app/dashboard/page.tsx"_ then we will have the route _"/dashboard"_ and in the Main directory we will have a file with the address _"~/Main/Dashboard/Dashboard.tsx"_.
   &nbsp;
   In this pattern, we only create the route in "/app/dashboard/page.tsx/~" and do not define any other entities except those that must be defined there, and we move the entire main body of the module to the equivalent directory of that route in Main, namely "~/Main/Dashboard/Dashboard.tsx".
   &nbsp;
   In other words, the main module of the addr is developed inside Main and the app directory is used solely for defining routes.
   &nbsp;
   We **do not have the right to define fractal entities at the root** of this directory and can only define directories equivalent to routing, but within each of these nested directories, we can implement the fractal modular structure.

2. **/app** and **Next JS reserved names**
   According to the [NextJS documentation](https://nextjs.org/docs/app/api-reference/file-conventions), the file names (page.tsx, layout.tsx, ...) and directory naming conventions in the AppRouter structure are reserved, and it is best not to use these structures in other parts of the project, and if required, the reason should be stated in the main project documentation.

3. **/public**
   The location of [public file definitions](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder) according to the NextJs documentation and it is best not to use these names in other parts of the project, and if required, the reason should be stated in the main project documentation.

&nbsp;

&nbsp;

[< back](/README.md)
