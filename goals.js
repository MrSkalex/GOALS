document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('goal-form');
  const input = document.getElementById('goal-input');
  const deadlineInput = document.getElementById('deadline-input');
  const list = document.getElementById('goals-list');

  let goals = JSON.parse(localStorage.getItem('goals') || '[]');
  goals.forEach(addGoalToDOM);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const goal = input.value.trim();
    const deadline = deadlineInput.value;
    if (goal && deadline) {
      const goalObj = { text: goal, deadline };
      goals.push(goalObj);
      localStorage.setItem('goals', JSON.stringify(goals));
      addGoalToDOM(goalObj);
      input.value = '';
      deadlineInput.value = '';
    }
  });

  function addGoalToDOM(goalObj) {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'center';

    // Goal text
    const goalText = document.createElement('span');
    goalText.textContent = goalObj.text;
    li.appendChild(goalText);

    // Green line
    const greenLine = document.createElement('span');
    greenLine.style.height = '4px';
    greenLine.style.background = 'limegreen';
    greenLine.style.marginLeft = '20px';
    greenLine.style.marginRight = '10px';
    greenLine.style.borderRadius = '2px';
    greenLine.style.transition = 'width 1s linear';
    greenLine.style.display = 'inline-block';
    li.appendChild(greenLine);

    // Deadline display
    const deadlineDisplay = document.createElement('span');
    deadlineDisplay.textContent = `Deadline: ${goalObj.deadline}`;
    deadlineDisplay.style.marginRight = '10px';
    li.appendChild(deadlineDisplay);

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = function () {
      goals = goals.filter(g => !(g.text === goalObj.text && g.deadline === goalObj.deadline));
      localStorage.setItem('goals', JSON.stringify(goals));
      li.remove();
    };
    li.appendChild(delBtn);

    list.appendChild(li);

    // Animate the green line
    function updateLine() {
      const now = new Date();
      const start = new Date(goalObj.createdAt || goalObj.addedAt || now);
      const end = new Date(goalObj.deadline);
      if (!goalObj.createdAt) {
        goalObj.createdAt = now.toISOString();
        localStorage.setItem('goals', JSON.stringify(goals));
      }
      const total = end - new Date(goalObj.createdAt);
      const left = end - now;
      let percent = Math.max(0, Math.min(1, left / total));
      greenLine.style.width = percent > 0 ? `${40 + 100 * percent}px` : '0px';
      if (percent <= 0) {
        greenLine.style.display = 'none';
      } else {
        greenLine.style.display = 'inline-block';
        requestAnimationFrame(updateLine);
      }
    }
    updateLine();
  }
});