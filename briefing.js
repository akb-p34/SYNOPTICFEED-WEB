// Slide Navigation
let currentSlide = 0;
const totalSlides = 13;

function initPresentation() {
    updateSlide(0);
    initCharts();
    setupEventListeners();
}

function setupEventListeners() {
    document.getElementById('prevSlide').addEventListener('click', () => changeSlide(-1));
    document.getElementById('nextSlide').addEventListener('click', () => changeSlide(1));
    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
    document.getElementById('downloadBtn').addEventListener('click', downloadPDF);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') changeSlide(-1);
        if (e.key === 'ArrowRight') changeSlide(1);
        if (e.key === 'Escape' && document.fullscreenElement) exitFullscreen();
        if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    });
}

function changeSlide(direction) {
    const newSlide = currentSlide + direction;
    if (newSlide >= 0 && newSlide < totalSlides) {
        updateSlide(newSlide);
    }
}

function updateSlide(slideNum) {
    // Update active slide with left-to-right animation
    document.querySelectorAll('.slide').forEach((slide, index) => {
        slide.classList.remove('active', 'next');
        // Remove inline styles to let CSS handle transforms
        slide.style.transform = '';

        if (index === slideNum) {
            slide.classList.add('active');
        } else if (index > slideNum) {
            slide.classList.add('next');
        }
        // Slides before current will use default CSS transform
    });

    // Update counter
    document.getElementById('currentSlide').textContent = slideNum + 1;

    // Update progress bar
    const progress = ((slideNum + 1) / totalSlides) * 100;
    document.getElementById('progressBar').style.width = progress + '%';

    // Update button states
    document.getElementById('prevSlide').disabled = slideNum === 0;
    document.getElementById('nextSlide').disabled = slideNum === totalSlides - 1;

    currentSlide = slideNum;
}

function toggleFullscreen() {
    const container = document.querySelector('.presentation-container');
    if (!document.fullscreenElement) {
        container.requestFullscreen().then(() => {
            container.classList.add('fullscreen');
        });
    } else {
        exitFullscreen();
    }
}

function exitFullscreen() {
    document.exitFullscreen().then(() => {
        document.querySelector('.presentation-container').classList.remove('fullscreen');
    });
}

// Charts with increased sizes
function initCharts() {
    drawProblemChart();
    drawSpeedChart();
    drawMarketChart();
    drawPricingChart();
    drawTimelineChart();
    drawFundingChart();
}

function drawProblemChart() {
    const canvas = document.getElementById('chart-problem');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 700;
    canvas.height = 350;
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Data
    const data = [
        { label: 'Public/free', value: 6.5 },
        { label: 'Typical vendor', value: 3.5 },
        { label: 'Build-it-yourself', value: 4 }
    ];

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, height - 60);
    ctx.lineTo(width - 60, height - 60);
    ctx.moveTo(60, 60);
    ctx.lineTo(60, height - 60);
    ctx.stroke();

    // Draw bars
    const barWidth = (width - 180) / data.length;
    data.forEach((item, index) => {
        const barHeight = (item.value / 10) * (height - 120);
        const x = 90 + index * barWidth;
        const y = height - 60 - barHeight;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x, y, barWidth - 40, barHeight);

        // Labels
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Helvetica Neue';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, x + barWidth/2 - 20, height - 35);
        ctx.font = 'bold 16px Helvetica Neue';
        ctx.fillText(item.value + ' min', x + barWidth/2 - 20, y - 15);
    });

    // Y-axis label
    ctx.save();
    ctx.translate(25, height/2);
    ctx.rotate(-Math.PI/2);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Helvetica Neue';
    ctx.textAlign = 'center';
    ctx.fillText('Minutes to desk', 0, 0);
    ctx.restore();
}

function drawSpeedChart() {
    const canvas = document.getElementById('chart-speed');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 700;
    canvas.height = 350;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Data
    const categories = ['Sat/Lightning', 'Radar', 'Models'];
    const data = {
        'Public/free': [6, 4, 60],
        'Typical vendor': [4, 3.5, 20],
        'SYFE Pro': [2, 2.5, 1]
    };

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, height - 60);
    ctx.lineTo(width - 60, height - 60);
    ctx.moveTo(60, 60);
    ctx.lineTo(60, height - 60);
    ctx.stroke();

    // Draw clustered bars
    const groupWidth = (width - 180) / categories.length;
    const barWidth = groupWidth / 4;

    categories.forEach((category, catIndex) => {
        const x = 90 + catIndex * groupWidth;

        Object.keys(data).forEach((series, seriesIndex) => {
            const value = data[series][catIndex];
            const barHeight = Math.min((value / 60) * (height - 120), height - 120);
            const barX = x + seriesIndex * barWidth;
            const barY = height - 60 - barHeight;

            // Different opacity for each series
            ctx.fillStyle = series === 'SYFE Pro' ? '#B10202' : `rgba(255, 255, 255, ${0.3 + seriesIndex * 0.3})`;
            ctx.fillRect(barX, barY, barWidth - 5, barHeight);

            // Value labels
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '12px Helvetica Neue';
            ctx.textAlign = 'center';
            ctx.fillText(value + (value < 10 ? 'm' : 'm'), barX + barWidth/2, barY - 5);
        });

        // Category labels
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Helvetica Neue';
        ctx.textAlign = 'center';
        ctx.fillText(category, x + groupWidth/2 - 20, height - 35);
    });

    // Legend
    ctx.font = '12px Helvetica Neue';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillText('Public/free', width - 150, 30);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('Typical vendor', width - 150, 50);
    ctx.fillStyle = '#B10202';
    ctx.fillText('SYFE Pro', width - 150, 70);
}

function drawMarketChart() {
    const canvas = document.getElementById('chart-market');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 450;
    canvas.height = 450;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Data
    const data = [
        { label: 'TAM', value: 2700, color: 'rgba(255, 255, 255, 0.2)' },
        { label: 'SAM', value: 225, color: 'rgba(255, 255, 255, 0.4)' },
        { label: 'SOM', value: 4, color: '#B10202' }
    ];

    // Draw donut chart
    data.forEach((item, index) => {
        const radius = 140 - index * 35;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 35;
        ctx.stroke();

        // Labels
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 14px Helvetica Neue';
        ctx.textAlign = 'center';
        ctx.fillText(item.label + ': $' + item.value + (item.value < 100 ? 'M' : 'B'), centerX, centerY + 180 + index * 25);
    });
}

function drawPricingChart() {
    const canvas = document.getElementById('chart-pricing');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 700;
    canvas.height = 300;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Updated data for new pricing
    const data = [
        { label: 'Pilot', value: 0 },
        { label: 'Desk', value: 150 },
        { label: 'Pod', value: 225 },
        { label: 'Firm', value: 350 }
    ];

    // Draw ladder chart
    const stepWidth = (width - 100) / data.length;
    const maxValue = 400;

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((item, index) => {
        const x = 50 + index * stepWidth;
        const y = height - 60 - (item.value / maxValue) * (height - 120);

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            // Draw step
            ctx.lineTo(x, data[index-1].y);
            ctx.lineTo(x, y);
        }

        // Store y for next iteration
        item.y = y;

        // Draw circle at each point
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Draw value
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 14px Helvetica Neue';
        ctx.textAlign = 'center';
        ctx.fillText(item.value === 0 ? 'Free' : '$' + item.value + 'k', x, y - 15);
        ctx.font = '14px Helvetica Neue';
        ctx.fillText(item.label, x, height - 30);
    });

    ctx.stroke();
}

function drawTimelineChart() {
    const canvas = document.getElementById('chart-timeline');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 200;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Timeline data
    const milestones = [
        { month: 1, label: 'HRIT live', y: 50 },
        { month: 2, label: 'API v0.9', y: 80 },
        { month: 3, label: '3 pilots', y: 50 },
        { month: 6, label: 'Site #1', y: 80 },
        { month: 7, label: 'Pro GA', y: 50 },
        { month: 12, label: '$2.8M ARR', y: 80 }
    ];

    // Draw timeline
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(60, height / 2);
    ctx.lineTo(width - 60, height / 2);
    ctx.stroke();

    // Draw milestones
    milestones.forEach(milestone => {
        const x = 60 + (milestone.month / 12) * (width - 120);

        // Milestone dot
        ctx.beginPath();
        ctx.arc(x, height / 2, 6, 0, 2 * Math.PI);
        ctx.fillStyle = milestone.month <= 3 ? '#B10202' : '#FFFFFF';
        ctx.fill();

        // Milestone line and label
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, height / 2);
        ctx.lineTo(x, milestone.y);
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Helvetica Neue';
        ctx.textAlign = 'center';
        ctx.fillText(milestone.label, x, milestone.y - 10);
    });

    // Period labels
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Helvetica Neue';
    ctx.fillText('PILOT PHASE', width / 4, height - 20);
    ctx.fillText('PRO BUILD', width / 2, height - 20);
    ctx.fillText('SCALE', 3 * width / 4, height - 20);
}

function drawFundingChart() {
    const canvas = document.getElementById('chart-funding');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 450;
    canvas.height = 450;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Data with green/purple/cyan colors
    const data = [
        { label: 'People', value: 40, color: '#00FF9F' },
        { label: 'Cloud/Infra', value: 30, color: '#9945FF' },
        { label: 'Hardware', value: 10, color: '#00D4FF' },
        { label: 'Legal/Other', value: 20, color: 'rgba(0, 212, 255, 0.5)' }
    ];

    // Draw pie chart
    let currentAngle = -Math.PI / 2;
    const radius = 120;

    data.forEach(item => {
        const sliceAngle = (item.value / 100) * 2 * Math.PI;

        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius + 40);
        const labelY = centerY + Math.sin(labelAngle) * (radius + 40);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Helvetica Neue';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, labelX, labelY);
        ctx.font = 'bold 14px Helvetica Neue';
        ctx.fillText(item.value + '%', labelX, labelY + 18);

        currentAngle += sliceAngle;
    });

    // Center label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Helvetica Neue';
    ctx.textAlign = 'center';
    ctx.fillText('$200K', centerX, centerY);
    ctx.font = '12px Helvetica Neue';
    ctx.fillText('POC FUND', centerX, centerY + 20);
}

// PDF Export with jsPDF
async function downloadPDF() {
    if (typeof window.jspdf === 'undefined') {
        // Load jsPDF if not already loaded
        await loadJsPDF();
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('landscape', 'mm', 'a4');

    // Get all slides
    const slides = document.querySelectorAll('.slide');
    const originalSlide = currentSlide;

    // Show loading message
    const toast = document.getElementById('toast') || createToast();
    toast.textContent = 'Generating PDF...';
    toast.classList.add('show');

    try {
        for (let i = 0; i < slides.length; i++) {
            // Navigate to each slide
            updateSlide(i);

            // Wait for animations to complete
            await new Promise(resolve => setTimeout(resolve, 500));

            // Capture the slide
            const slideElement = slides[i];
            const canvas = await html2canvas(slideElement, {
                backgroundColor: '#000000',
                scale: 2
            });

            const imgData = canvas.toDataURL('image/png');

            if (i > 0) {
                pdf.addPage();
            }

            // Add image to PDF (A4 landscape dimensions)
            pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
        }

        // Save the PDF
        pdf.save('SYNOPTICFEED_Technical_Briefing_2025.pdf');

        toast.textContent = 'PDF downloaded successfully!';
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);

    } catch (error) {
        console.error('Error generating PDF:', error);
        toast.textContent = 'Error generating PDF';
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Return to original slide
    updateSlide(originalSlide);
}

function createToast() {
    const toast = document.createElement('div');
    toast.id = 'pdf-toast';
    toast.className = 'toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #FFFFFF;
        color: #000000;
        padding: 12px 24px;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        opacity: 0;
        visibility: hidden;
        transition: opacity 200ms, visibility 200ms;
        z-index: 10000;
    `;
    toast.style.opacity = '0';
    document.body.appendChild(toast);
    return toast;
}

async function loadJsPDF() {
    return new Promise((resolve) => {
        if (window.jspdf) {
            resolve();
        } else {
            // Wait for jsPDF to be loaded from CDN
            setTimeout(() => {
                if (window.jspdf) {
                    resolve();
                } else {
                    console.error('jsPDF not loaded. Please check CDN link.');
                    resolve();
                }
            }, 1000);
        }
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initPresentation);