document.addEventListener('DOMContentLoaded', () => {
    const recordedTimeInput = document.getElementById('recordedTime');
    const workedInput = document.getElementById('workedHours');
    const targetInput = document.getElementById('targetHours');
    const calculateBtn = document.getElementById('calculateBtn');

    const resultsSection = document.getElementById('resultsSection');
    const currentTotalStr = document.getElementById('currentTotalStr');
    const leaveTimeStr = document.getElementById('leaveTimeStr');
    const remainingTimeStr = document.getElementById('remainingTimeStr');
    const resultBox = resultsSection.querySelector('.result-box');

    function calculate() {
        const timeVal = recordedTimeInput.value; // e.g. "11:06"
        const workedVal = parseFloat(workedInput.value);
        const targetVal = parseFloat(targetInput.value);

        // Validation
        if (!timeVal) {
            recordedTimeInput.focus();
            return;
        }
        if (isNaN(workedVal) || workedVal < 0) {
            workedInput.focus();
            return;
        }
        if (isNaN(targetVal) || targetVal < 0) {
            targetInput.focus();
            return;
        }

        // 1. Parse the recorded time into a Date object (today's date)
        const [hours, minutes] = timeVal.split(':').map(Number);
        const recordedDate = new Date();
        recordedDate.setHours(hours, minutes, 0, 0);

        // 2. Get current time
        const now = new Date();

        // 3. Calculate elapsed time since measurement (in decimal hours)
        const elapsedMs = now.getTime() - recordedDate.getTime();
        const elapsedDecHours = elapsedMs / (1000 * 60 * 60);

        // 4. Current total = recorded hours + elapsed time
        const currentTotal = workedVal + elapsedDecHours;

        // 5. Remaining = target - current total
        const remainingDec = targetVal - currentTotal;

        // Show results and trigger animation
        resultsSection.style.display = 'block';
        resultsSection.classList.remove('hidden');
        resultBox.classList.remove('pop-in');
        void resultBox.offsetWidth; // Force reflow to restart animation
        resultBox.classList.add('pop-in');

        // Show current total
        currentTotalStr.textContent = `Current total: ${currentTotal.toFixed(2)} hrs`;

        // Handle case where target is already met
        if (remainingDec <= 0) {
            leaveTimeStr.textContent = "DONE!";
            remainingTimeStr.textContent = "Target reached. Go home!";
            leaveTimeStr.style.fontSize = "3.5rem";
            return;
        } else {
            leaveTimeStr.style.fontSize = "4.5rem";
        }

        // 6. Convert remaining decimal to hours and minutes
        const remainingHrs = Math.floor(remainingDec);
        const remainingMins = Math.round((remainingDec - remainingHrs) * 60);

        // 7. Compute leave time (current time + remaining duration)
        const leaveDate = new Date(now.getTime() + remainingDec * 60 * 60 * 1000);

        // 8. Format the leave time (e.g., 5:15 PM)
        const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
        const formattedLeaveTime = leaveDate.toLocaleTimeString([], timeOptions);

        // 9. Create readable duration text
        let durationText = '';
        if (remainingHrs > 0) {
            durationText += `${remainingHrs} hr${remainingHrs > 1 ? 's' : ''}`;
        }
        if (remainingMins > 0) {
            if (remainingHrs > 0) durationText += ' ';
            durationText += `${remainingMins} min${remainingMins > 1 ? 's' : ''}`;
        }
        durationText += ' remaining';

        // 10. Update the UI
        leaveTimeStr.textContent = formattedLeaveTime;
        remainingTimeStr.textContent = durationText;
    }

    // Event listeners
    calculateBtn.addEventListener('click', calculate);

    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculate();
        }
    });
});
