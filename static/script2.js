document.getElementById('uploadForm').onsubmit = async function (event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    const formData = new FormData(this); // Create a FormData object from the form

    // Descriptions for each person
    const descriptions = {
        "Faraz": "Faraz is a bobbySon He loves to play cricket and his favourite thing is Bobby the king's Balls lifting .",
        "Imran": "Imran is a software engineer with a passion for developing innovative solutions and has a background in mobile and web development.",
        "Shahzeb": "Shahzeb is a data scientist who enjoys solving complex problems through data analytics and machine learning techniques."
    };

    try {
        // Send the form data to the server using Fetch
        const response = await fetch('/', {
            method: 'POST',
            body: formData
        });

        // Parse the response as JSON
        const result = await response.json();

        // Update the result container with the prediction result and description
        const resultDiv = document.getElementById('result');
        if (result.error) {
            resultDiv.innerText = `Error: ${result.error}`;
            resultDiv.style.color = "red"; // Display error in red
        } else {
            const predictedPerson = result['The person name is'];
            const description = descriptions[predictedPerson] || "Description not available.";
            resultDiv.innerHTML = `
                <p style="color: #007BFF; font-weight: bold;">Predicted Person: ${predictedPerson}</p>
                <p style="color: #555;">${description}</p>
            `;
        }
    } catch (error) {
        // Handle any errors that occur during the request
        const resultDiv = document.getElementById('result');
        resultDiv.innerText = `Error: ${error.message}`;
        resultDiv.style.color = "red";
    }
};

// Neural Network Background Animation
const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

// Set canvas to window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeNodes();
});

const nodes = [];
const numNodes = 100;
const maxSpeed = 2;

// Initialize nodes
function initializeNodes() {
    nodes.length = 0;
    for (let i = 0; i < numNodes; i++) {
        const node = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * maxSpeed,
            vy: (Math.random() - 0.5) * maxSpeed,
            radius: 3
        };
        nodes.push(node);
    }
}

// Draw the nodes and connecting lines
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw lines between nodes
    ctx.strokeStyle = 'rgba(0, 123, 255, 0.2)'; // Light blue for connecting lines
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const distance = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
            }
        }
    }

    // Draw nodes and update their positions
    ctx.fillStyle = '#007BFF'; // Blue color for nodes
    for (let node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off the walls
        if (node.x > canvas.width || node.x < 0) {
            node.vx *= -1;
        }
        if (node.y > canvas.height || node.y < 0) {
            node.vy *= -1;
        }
    }

    // Loop the animation
    requestAnimationFrame(draw);
}

// Initialize and start the animation
initializeNodes();
draw();
