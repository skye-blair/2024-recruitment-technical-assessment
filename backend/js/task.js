/**
 * Modified Task 1 as helper for task 3
 */
function getLeafFiles(files) {
    const parentIds = new Set();
    const leafFiles = [];
    
    // Find unique IDs of parent files
    for (const file of files) {
        parentIds.add(file.parent);
    }

    // Check if each file is a parent and remove from parentIds when found
    for (const file of files) {
        if (!parentIds.delete(file.id)) {
            leafFiles.push(file);
        }
    }

    // Return array of leaf files
    return leafFiles;
}

/**
 * Task 1
 */
function leafFiles(files) {
    // Get leaf files
    const leafFiles = getLeafFiles(files);

    // Return names only
    return leafFiles.map(item => item.name);
}

/**
 * Task 2
 */
function kLargestCategories(files, k) {
    const categoryCount = [];
    let categoryArray = [];
    let categoryNames = [];

    // Get count of each category
    for (const file of files) {
        for (const category of file.categories) {
            if (!categoryCount[category]) {
                categoryCount[category] = 1;
            } else {
                categoryCount[category]++;
            }
        }
    }

    // Sort by mapping to array
    categoryArray = Object.keys(categoryCount).map(item => [item, categoryCount[item]]);
    categoryArray.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

    // Take names of first k categories
    categoryNames = categoryArray.slice(0,k).map(a => a[0]);

    // Return list of k categories
    return categoryNames;
}

/**
 * Task 3
 */
function largestFileSize(files) {
    // No files
    if (files.length == 0) {
        return 0;
    }

    // Have list of uncalculated files, and dictionary of each file's size
    let notCalculatedFiles = structuredClone(files);
    const fileSizes = Object.assign({}, ...files.map(file => ({[file.id]: file.size})));
    
    // Update all file sizes
    while (notCalculatedFiles.length != 0) {
        // Get leaf files
        const leafFiles = getLeafFiles(notCalculatedFiles);
        // Update size of parents
        for (const file of leafFiles) {
            fileSizes[file.parent] += fileSizes[file.id];
        }
        // Remove from not calculated list
        notCalculatedFiles = notCalculatedFiles.filter(item => !leafFiles.includes(item));
    }

    // Map file sizes to array and sort to find largest
    const fileSizesArray = Object.keys(fileSizes).map(item => fileSizes[item]);
    fileSizesArray.sort((a, b) => b - a);

    return fileSizesArray[0];
}


function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

const testFiles = [
    { id: 1, name: "Document.txt", categories: ["Documents"], parent: 3, size: 1024 },
    { id: 2, name: "Image.jpg", categories: ["Media", "Photos"], parent: 34, size: 2048 },
    { id: 3, name: "Folder", categories: ["Folder"], parent: -1, size: 0 },
    { id: 5, name: "Spreadsheet.xlsx", categories: ["Documents", "Excel"], parent: 3, size: 4096 },
    { id: 8, name: "Backup.zip", categories: ["Backup"], parent: 233, size: 8192 },
    { id: 13, name: "Presentation.pptx", categories: ["Documents", "Presentation"], parent: 3, size: 3072 },
    { id: 21, name: "Video.mp4", categories: ["Media", "Videos"], parent: 34, size: 6144 },
    { id: 34, name: "Folder2", categories: ["Folder"], parent: 3, size: 0 },
    { id: 55, name: "Code.py", categories: ["Programming"], parent: -1, size: 1536 },
    { id: 89, name: "Audio.mp3", categories: ["Media", "Audio"], parent: 34, size: 2560 },
    { id: 144, name: "Spreadsheet2.xlsx", categories: ["Documents", "Excel"], parent: 3, size: 2048 },
    { id: 233, name: "Folder3", categories: ["Folder"], parent: -1, size: 4096 },
];

console.assert(arraysEqual(
    leafFiles(testFiles).sort((a, b) => a.localeCompare(b)),
    [
        "Audio.mp3",
        "Backup.zip",
        "Code.py",
        "Document.txt",
        "Image.jpg",
        "Presentation.pptx",
        "Spreadsheet.xlsx",
        "Spreadsheet2.xlsx",
        "Video.mp4"
    ]
));

console.assert(arraysEqual(
    kLargestCategories(testFiles, 3),
    ["Documents", "Folder", "Media"]
));

console.assert(largestFileSize(testFiles) == 20992)
