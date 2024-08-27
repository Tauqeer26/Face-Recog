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
const maxSpeed = 2;  // Adjusted speed for a smoother animation

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
    ctx.strokeStyle = 'rgba(0, 123, 255, 0.2)';  // Light blue for connecting lines
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
    ctx.fillStyle = '#007BFF';  // Blue color for nodes
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
