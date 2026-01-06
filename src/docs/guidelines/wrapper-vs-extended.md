# Wrapper directory and Extended directory

In general, each directory can have one of two states:

### Wrapper directory

Directories that are defined solely for packaging a number of fractal entities or custom and split files are called Wrapper directories.

Wrapper directories have no root file and their contents can be considered as twins that are parallel. In other words, within a wrapper directory we can have many exports that are imported and used independently and are placed in a wrapper directory simply because of semantic and functional proximity.

For example, the non-fractal directory **"~/Main"** is a directory wrapper there are at least as many parallel exports as there are directories in which they are directly located.

&nbsp;

### Extended directory

Extended directories could actually be a file, but due to the need for separation and parsing for greater readability and easier development, they have become a directory. They always have a root file with the same name as the directory itself directly inside them, and other files and side directories are considered its direct or indirect children.

Note that in the common definition of these directories, there should only be one export, but because our pattern in this fractal project is modular, we often have more than one export.

Therefore, the basis for distinguishing a Wrapper directory from an Extended directory is the presence or absence of a file with the same name as the directory itself in the root of the directory.

For example, the **directories inside "~/Main"** that correspond to routes are always extended directories with a root file.

&nbsp;

&nbsp;

[< back](/README.md)
