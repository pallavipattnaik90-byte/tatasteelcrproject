const modelEl = document.getElementById("model");
const carsEl = document.getElementById("cars");
const gradeTable = document.getElementById("gradeTable");
const skuTable = document.getElementById("skuTable");
const partImage = document.getElementById("partImage");
const truckImage = document.getElementById("truckImage");
const pie = document.getElementById("pie");

let chart;

const partImages = {
"Toe Panel":"toe.png",
"Roof":"roof.png",
"Door Outer":"door.png",
"Assy. Bonnet Side Complete":"bonnet.png",
"Assy. Rear Wall":"rearwall.png",
"Assy. Corner Panel":"corner.png",
"Door Outer Bottom":"door_bottom.png",
"Door Inner Bottom":"door_inner.png",
"Rear Wall":"rearwall.png",
"Corner Panel":"corner.png",
"Panel Outer Windsheild":"windshield.png",
"Face Panel":"face.png",
"Assembly Cover":"cover.png",
"Oil Pan":"oilpan.png",
"Corner Support 8207":"corner1.png",
"Corner Support 0607":"corner2.png",
"Push Rod Cover":"pushrod.png",
"Window Panel":"window.png",
};

const truckImages = {
"SFC":"sfc.png",
"BIG CAB (NON-SLEEPER)":"bigcab.png",
"BIG CAB (SLEEPER)":"sleeper.png"
};

function calculate() {

    let model = modelEl.value;
    let cars = parseInt(carsEl.value) || 1;

    let result = {};
    let total = 0;

    let gradeHTML = "<tr><th>Grade</th><th>Weight</th></tr>";
    let skuHTML = "<tr><th>Part</th><th>SKU</th><th>Qty</th><th>Weight</th></tr>";

    data.forEach(d => {
        if (d.model === model) {

            let w = d.weight * cars;
            result[d.grade] = (result[d.grade] || 0) + w;
            total += w;

            skuHTML += `
            <tr onclick="showPart('${d.part}')">
                <td>${d.part}</td>
                <td>${d.sku}</td>
                <td>${d.qty}</td>
                <td>${w.toFixed(2)}</td>
            </tr>`;
        }
    });

    for (let g in result) {
        gradeHTML += `<tr><td>${g}</td><td>${result[g].toFixed(2)}</td></tr>`;
    }

    gradeTable.innerHTML = gradeHTML;
    skuTable.innerHTML = skuHTML;

    animateTotal(total);   // ✅ animated
    drawPie(result);
}

/* 🔥 TOTAL ANIMATION */
function animateTotal(finalValue){
    let startTime = null;
    let duration = 1200;

    function animate(time){
        if(!startTime) startTime = time;

        let progress = time - startTime;
        let percent = Math.min(progress/duration,1);

        let value = percent * finalValue;

        document.getElementById("total").innerText =
            "Total: " + value.toFixed(2) + " KG";

        if(percent < 1){
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

/* 🔥 PIE ANIMATION */
function drawPie(result) {

    if (chart) chart.destroy();

    pie.style.opacity = 0;
    pie.style.transform = "scale(0.7) rotate(-20deg)";

    setTimeout(() => {

        pie.style.transition = "0.6s ease";
        pie.style.opacity = 1;
        pie.style.transform = "scale(1) rotate(0deg)";

        chart = new Chart(pie, {
            type: 'pie',
            data: {
                labels: Object.keys(result),
                datasets: [{
                    data: Object.values(result),
                    backgroundColor: ["#3b82f6","#22c55e","#f97316"],
                    hoverOffset: 25
                }]
            },
            options: {
                responsive:true,
                maintainAspectRatio:false,
                animation:{
                    duration:1400,
                    easing:'easeOutExpo'
                }
            }
        });

    }, 120);
}

function showPart(part) {
    partImage.src = partImages[part] || "placeholder.png";
}

modelEl.addEventListener("change", e=>{
    truckImage.src = truckImages[e.target.value];
    partImage.src = "placeholder.png";
});
