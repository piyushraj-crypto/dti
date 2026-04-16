// Greywater Filtration Prototype Logic
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const btnStart = document.getElementById('btn-start');
    const btnStop = document.getElementById('btn-stop');
    const btnReset = document.getElementById('btn-reset');
    const statusBadge = document.getElementById('flow-status');
    
    const waterValue = document.getElementById('water-value');
    const appReused = document.getElementById('app-reused');
    const filterBar = document.getElementById('filter-health');
    const filterStatusText = document.getElementById('filter-status-text');
    const safetyText = document.getElementById('safety-text');
    const appAlert = document.getElementById('app-alert');

    const indSafe = document.getElementById('ind-safe');
    const indMod = document.getElementById('ind-mod');
    const indUnsafe = document.getElementById('ind-unsafe');

    const mainSchematic = document.getElementById('main-schematic');
    const waterDrop = document.getElementById('water-drop');

    // State
    let isFlowing = false;
    let volume = 0;
    let filterHealth = 100;
    let flowInterval;

    // Helper: Create Flow Path
    const createFlowPath = (pathId, d) => {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        path.setAttribute("class", "pipe-flow");
        path.setAttribute("id", pathId + "-flow");
        mainSchematic.appendChild(path);
        return path;
    };

    // Initialize Flow Paths
    const flowInlet = createFlowPath("pipe-inlet", "M 170 125 L 250 125 L 250 200");
    const flowOutlet = createFlowPath("pipe-outlet", "M 250 540 L 250 600 L 400 600");

    // Simulation Loop
    function startFiltration() {
        if (isFlowing) return;
        
        isFlowing = true;
        statusBadge.textContent = "ACTIVE";
        statusBadge.classList.add('active');
        flowInlet.style.visibility = "visible";
        flowOutlet.style.visibility = "visible";
        btnStart.disabled = true;

        flowInterval = setInterval(() => {
            // Update Volume
            volume += 0.1;
            waterValue.textContent = volume.toFixed(1);
            appReused.textContent = volume.toFixed(0) + "L";

            // Update Filter Health
            filterHealth -= 0.05;
            if (filterHealth < 0) filterHealth = 0;
            filterBar.style.width = filterHealth + "%";

            // Update Status & Safety
            updateSystemState();

            // Animate Drop
            animateDrop();

        }, 200);
    }

    function stopFiltration() {
        isFlowing = false;
        clearInterval(flowInterval);
        statusBadge.textContent = "IDLE";
        statusBadge.classList.remove('active');
        flowInlet.style.visibility = "hidden";
        flowOutlet.style.visibility = "hidden";
        btnStart.disabled = false;
        waterDrop.style.opacity = 0;
    }

    function resetFilter() {
        stopFiltration();
        volume = 0;
        filterHealth = 100;
        
        waterValue.textContent = "0.0";
        appReused.textContent = "0L";
        filterBar.style.width = "100%";
        
        updateSystemState();
        
        // Flash effect
        filterBar.parentElement.style.boxShadow = "0 0 15px var(--accent-safe)";
        setTimeout(() => filterBar.parentElement.style.boxShadow = "none", 500);
    }

    function updateSystemState() {
        // Filter Status Text
        if (filterHealth > 80) {
            filterStatusText.textContent = "Excellent";
            filterBar.style.background = "linear-gradient(90deg, #22c55e, #38bdf8)";
        } else if (filterHealth > 40) {
            filterStatusText.textContent = "Good - Monitor";
            filterBar.style.background = "linear-gradient(90deg, #eab308, #38bdf8)";
        } else {
            filterStatusText.textContent = "Service Required";
            filterBar.style.background = "linear-gradient(90deg, #ef4444, #38bdf8)";
        }

        // Safety Indicators
        const indicators = [indSafe, indMod, indUnsafe];
        indicators.forEach(i => i.classList.remove('active'));

        if (filterHealth > 60) {
            indSafe.classList.add('active');
            safetyText.textContent = "Safe for Reuse";
            safetyText.style.color = "var(--accent-safe)";
            appAlert.textContent = "Filter Optimal";
            appAlert.style.background = "rgba(34, 197, 94, 0.1)";
            appAlert.style.color = "var(--accent-safe)";
        } else if (filterHealth > 20) {
            indMod.classList.add('active');
            safetyText.textContent = "Moderate - Non-Potable";
            safetyText.style.color = "var(--accent-warn)";
            appAlert.textContent = "Cleaning Soon";
            appAlert.style.background = "rgba(234, 179, 8, 0.1)";
            appAlert.style.color = "var(--accent-warn)";
        } else {
            indUnsafe.classList.add('active');
            safetyText.textContent = "Unsafe - Maintenance Needed";
            safetyText.style.color = "var(--accent-danger)";
            appAlert.textContent = "REPLACE FILTER";
            appAlert.style.background = "rgba(239, 68, 68, 0.1)";
            appAlert.style.color = "var(--accent-danger)";
        }
    }

    function animateDrop() {
        waterDrop.style.opacity = 1;
        waterDrop.setAttribute("cy", "70");
        
        let dropPos = 70;
        const dropInterval = setInterval(() => {
            if (!isFlowing) {
                clearInterval(dropInterval);
                return;
            }
            dropPos += 5;
            waterDrop.setAttribute("cy", dropPos);
            
            if (dropPos > 120) {
                waterDrop.style.opacity = 0;
                clearInterval(dropInterval);
            }
        }, 30);
    }

    // Event Listeners
    btnStart.addEventListener('click', startFiltration);
    btnStop.addEventListener('click', stopFiltration);
    btnReset.addEventListener('click', resetFilter);
});
