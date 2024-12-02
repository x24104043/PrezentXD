const canvas = document.getElementById('puzzle-canvas');
const context = canvas.getContext('2d');
const puzzleContainer = document.getElementById('puzzle-container');
const successMessage = document.getElementById('success-message');
const initialMessage = document.getElementById('initial-message');

const originalImage = new Image();
originalImage.src = 'puzzle-image.jpg'; // Initial puzzle image
const solvedImage = new Image();
solvedImage.src = 'new-image.jpg'; // Replacement image after solving

const rows = 6; // Increased rows to double the complexity
const cols = 6; // Increased columns to double the complexity
let pieces = [];
let pieceWidth, pieceHeight;
let selectedPiece = null;

// Shuffle helper
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Check if the puzzle is solved
function isSolved() {
    return pieces.every((piece, index) => piece.index === index);
}

// Draw the puzzle
function drawPuzzle() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach((piece, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;

        // Draw the image section
        context.drawImage(
            originalImage,
            piece.col * pieceWidth,
            piece.row * pieceHeight,
            pieceWidth,
            pieceHeight,
            col * pieceWidth,
            row * pieceHeight,
            pieceWidth,
            pieceHeight
        );

        // Draw the border
        context.strokeStyle = "#000";
        context.strokeRect(col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight);

        // Removed the number overlay code
        // The following part was previously adding the numbers on the pieces:
        // context.font = "16px Arial";
        // context.fillStyle = "#FFF";
        // context.fillText(piece.index + 1, col * pieceWidth + 5, row * pieceHeight + 20);
    });
}

// Initialize the puzzle
function initPuzzle() {
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    pieceWidth = canvas.width / cols;
    pieceHeight = canvas.height / rows;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            pieces.push({ row, col, index: row * cols + col });
        }
    }

    pieces = shuffle(pieces);
    drawPuzzle();
}

// Replace puzzle with solved image and show final message
function showSolvedImage() {
    // Clear the canvas and draw the solved image
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(solvedImage, 0, 0, canvas.width, canvas.height);

    // Display the congratulatory message
    context.font = "bold 60px Arial";
    context.fillStyle = "gold";
    context.textAlign = "center";
    context.fillText("You deserve it BBY,", canvas.width / 2, canvas.height / 2 - 30);
    context.fillText("you are THE BEST!", canvas.width / 2, canvas.height / 2 + 30);

    // Hide the initial message
    initialMessage.classList.add('hidden');
}

// Handle piece selection and swapping
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / pieceWidth);
    const row = Math.floor(y / pieceHeight);
    const clickedIndex = row * cols + col;

    if (selectedPiece === null) {
        selectedPiece = clickedIndex;
        context.strokeStyle = "#f00";
        context.lineWidth = 3;
        context.strokeRect(col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight);
    } else {
        swapPieces(selectedPiece, clickedIndex);
        selectedPiece = null;
        drawPuzzle();

        if (isSolved()) {
            showSolvedImage();
        }
    }
});

// Swap pieces
function swapPieces(firstIndex, secondIndex) {
    [pieces[firstIndex], pieces[secondIndex]] = [pieces[secondIndex], pieces[firstIndex]];
}

// Load the original image and initialize the puzzle
originalImage.onload = initPuzzle;
