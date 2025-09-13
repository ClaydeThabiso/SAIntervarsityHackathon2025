  // Empty data structure
        let userData = {
            totalBalance: 0,
            boxes: [],
            transactions: [],
            points: 0,
            level: 1,
            quests: [],
            achievements: []
        };

        // Define available quests and achievements
        const availableQuests = [
            {
                id: 1,
                title: "First Box",
                description: "Create your first financial box",
                goal: 1,
                progress: 0,
                reward: 50,
                type: "create_box",
                completed: false
            },
            {
                id: 2,
                title: "Budget Master",
                description: "Create 5 different boxes",
                goal: 5,
                progress: 0,
                reward: 100,
                type: "create_box",
                completed: false
            },
            {
                id: 3,
                title: "Weekly Planner",
                description: "Create a weekly allowance box",
                goal: 1,
                progress: 0,
                reward: 75,
                type: "create_weekly_box",
                completed: false
            },
            {
                id: 4,
                title: "Financial Discipline",
                description: "Make 5 transactions without overspending",
                goal: 5,
                progress: 0,
                reward: 150,
                type: "successful_transactions",
                completed: false
            },
            {
                id: 5,
                title: "Early Saver",
                description: "Lock money for a future expense",
                goal: 1,
                progress: 0,
                reward: 60,
                type: "lock_money",
                completed: false
            }
        ];

        const availableAchievements = [
            {
                id: 1,
                title: "First Steps",
                description: "Set your initial balance",
                icon: "fa-flag",
                earned: false
            },
            {
                id: 2,
                title: "Box Collector",
                description: "Create 3 boxes",
                icon: "fa-box-open",
                earned: false
            },
            {
                id: 3,
                title: "Weekly Budgeter",
                description: "Create a weekly allowance box",
                icon: "fa-calendar-week",
                earned: false
            },
            {
                id: 4,
                title: "Financial Guardian",
                description: "Lock R100 or more for future expenses",
                icon: "fa-lock",
                earned: false
            },
            {
                id: 5,
                title: "On Track",
                description: "Complete 3 quests",
                icon: "fa-tasks",
                earned: false
            },
            {
                id: 6,
                title: "Savvy Spender",
                description: "Make 10 successful transactions",
                icon: "fa-money-bill-wave",
                earned: false
            },
            {
                id: 7,
                title: "Balance Master",
                description: "Reach Level 5",
                icon: "fa-star",
                earned: false
            },
            {
                id: 8,
                title: "Financial Guru",
                description: "Earn 500 points",
                icon: "fa-graduation-cap",
                earned: false
            }
        ];

        // DOM Elements
        const boxesList = document.getElementById('boxes-list');
        const transactionsList = document.getElementById('transactions-list');
        const totalValue = document.getElementById('total-value');
        const lockedValue = document.getElementById('locked-value');
        const availableValue = document.getElementById('available-value');
        const addBoxBtn = document.getElementById('add-box-btn');
        const addBoxModal = document.getElementById('add-box-modal');
        const closeModal = document.querySelector('.close');
        const boxForm = document.getElementById('box-form');
        const boxType = document.getElementById('box-type');
        const dueDateGroup = document.getElementById('due-date-group');
        const startDateGroup = document.getElementById('start-date-group');
        const onboarding = document.getElementById('onboarding');
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');
        const setupPrompt = document.getElementById('setup-prompt');
        const pointsValue = document.getElementById('points-value');
        const levelBadge = document.getElementById('level-badge');
        const questsSection = document.getElementById('quests-section');
        const questsList = document.getElementById('quests-list');
        const achievementsSection = document.getElementById('achievements-section');
        const achievementsList = document.getElementById('achievements-list');
        const rewardPopup = document.getElementById('reward-popup');
        const rewardTitle = document.getElementById('reward-title');
        const rewardDesc = document.getElementById('reward-desc');

        // Event Listeners
        addBoxBtn.addEventListener('click', () => {
            if (userData.totalBalance <= 0) {
                showNotification('Please set your initial balance first!', 'error');
                editBalance();
                return;
            }
            addBoxModal.style.display = 'flex';
        });
        
        closeModal.addEventListener('click', () => addBoxModal.style.display = 'none');
        
        boxType.addEventListener('change', () => {
            if (boxType.value === 'fixed') {
                dueDateGroup.style.display = 'block';
                startDateGroup.style.display = 'none';
            } else {
                dueDateGroup.style.display = 'none';
                startDateGroup.style.display = 'block';
            }
        });

        boxForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('box-name').value;
            const type = document.getElementById('box-type').value;
            const amount = parseFloat(document.getElementById('box-amount').value);
            
            // Check if user has enough balance
            if (amount > userData.totalBalance) {
                showNotification('You don\'t have enough balance for this box!', 'error');
                return;
            }
            
            // Handle both box types correctly
            if (type === 'fixed') {
                const dueDate = document.getElementById('due-date').value;
                if (!dueDate) {
                    showNotification('Please select a due date for fixed expenses', 'error');
                    return;
                }
                addNewBox(name, type, amount, dueDate);
            } else {
                const startDate = document.getElementById('start-date').value || new Date().toISOString().split('T')[0];
                addNewBox(name, type, amount, null, startDate);
            }
            
            // Reset form and close modal
            boxForm.reset();
            addBoxModal.style.display = 'none';
            showNotification('Box created successfully!');
        });

        // Initialize the app
        function initApp() {
            loadData();
            updateSummary();
            renderBoxes();
            renderTransactions();
            updateGamificationDisplay();
            renderQuests();
            renderAchievements();
            
            // Set today's date as default for date inputs
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('due-date').value = today;
            document.getElementById('start-date').value = today;
            
            // Show onboarding if first visit
            if (!localStorage.getItem('brdgeBoxOnboarded')) {
                onboarding.style.display = 'flex';
            }
            
            // Show setup prompt if no balance is set
            if (userData.totalBalance <= 0) {
                setupPrompt.style.display = 'block';
            } else {
                setupPrompt.style.display = 'none';
            }
        }

        // Save data to localStorage
        function saveData() {
            localStorage.setItem('brdgeBoxData', JSON.stringify(userData));
        }

        // Load data from localStorage
        function loadData() {
            const savedData = localStorage.getItem('brdgeBoxData');
            if (savedData) {
                userData = JSON.parse(savedData);
                
                // Update lock status based on current date
                updateLockStatus();
                
                // Initialize quests if not present
                if (!userData.quests || userData.quests.length === 0) {
                    userData.quests = JSON.parse(JSON.stringify(availableQuests));
                }
                
                // Initialize achievements if not present
                if (!userData.achievements || userData.achievements.length === 0) {
                    userData.achievements = JSON.parse(JSON.stringify(availableAchievements));
                }
            } else {
                // Initialize with empty quests and achievements for new users
                userData.quests = JSON.parse(JSON.stringify(availableQuests));
                userData.achievements = JSON.parse(JSON.stringify(availableAchievements));
            }
        }

        // Update lock status based on current date
        function updateLockStatus() {
            const today = new Date();
            
            userData.boxes.forEach(box => {
                if (box.type === 'fixed') {
                    const dueDate = new Date(box.dueDate);
                    box.locked = dueDate > today;
                }
            });
            
            saveData();
        }

        // Show notification
        function showNotification(message, type = 'success') {
            const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
            const borderColor = type === 'success' ? '#28a745' : '#dc3545';
            
            notificationText.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
            notification.style.borderLeftColor = borderColor;
            
            if (type === 'error') {
                notification.classList.add('error');
            } else {
                notification.classList.remove('error');
            }
            
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Edit balance
        function editBalance() {
            const newBalance = parseFloat(prompt("Enter your initial balance (R):", userData.totalBalance || ""));
            if (!isNaN(newBalance) && newBalance >= 0) {
                userData.totalBalance = newBalance;
                updateSummary();
                saveData();
                setupPrompt.style.display = 'none';
                showNotification('Balance set successfully!');
                
                // Check for achievements
                checkForAchievementProgress('set_balance');
            }
        }

        // Calculate days until unlock
        function daysUntilUnlock(dateString) {
            const today = new Date();
            const unlockDate = new Date(dateString);
            const diffTime = unlockDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        }

        // Check if a box is locked
        function isBoxLocked(box) {
            if (box.type === 'fixed') {
                const today = new Date();
                const dueDate = new Date(box.dueDate);
                return dueDate > today;
            }
            return false;
        }

        // Update summary values
        function updateSummary() {
            totalValue.textContent = `R${userData.totalBalance.toFixed(2)}`;
            
            // Calculate locked amount
            const lockedAmount = userData.boxes
                .filter(box => isBoxLocked(box))
                .reduce((sum, box) => sum + box.amount, 0);
                
            lockedValue.textContent = `R${lockedAmount.toFixed(2)}`;
            availableValue.textContent = `R${(userData.totalBalance - lockedAmount).toFixed(2)}`;
        }

        // Update gamification display
        function updateGamificationDisplay() {
            pointsValue.textContent = userData.points;
            levelBadge.textContent = `Level ${userData.level}`;
        }

        // Render boxes list
        function renderBoxes() {
            boxesList.innerHTML = '';
            
            if (userData.boxes.length === 0) {
                boxesList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon"><i class="fas fa-box-open"></i></div>
                        <h3>No boxes yet</h3>
                        <p>Create your first box to start managing your money!</p>
                    </div>
                `;
                return;
            }
            
            userData.boxes.forEach(box => {
                const boxItem = document.createElement('li');
                boxItem.className = 'box-item';
                if (isBoxLocked(box)) {
                    boxItem.classList.add('locked');
                }
                
                let details = '';
                if (box.type === 'fixed') {
                    const dueDate = new Date(box.dueDate).toLocaleDateString();
                    const daysLeft = daysUntilUnlock(box.dueDate);
                    const locked = isBoxLocked(box);
                    details = `Due: ${dueDate} | ${locked ? `Unlocks in ${daysLeft} days` : 'Unlocked'}`;
                } else {
                    details = `Weekly | Available: R${box.unlockedAmount.toFixed(2)}`;
                }
                
                const isLocked = isBoxLocked(box);
                
                boxItem.innerHTML = `
                    <div class="box-info">
                        <div class="box-name">${box.name}</div>
                        <div class="box-details">${details}</div>
                        ${isLocked ? `<div class="countdown"><i class="fas fa-clock"></i> Unlocks in ${daysUntilUnlock(box.dueDate)} days</div>` : ''}
                    </div>
                    <div class="box-amount ${isLocked ? 'locked' : 'unlocked'}">R${box.amount.toFixed(2)}</div>
                    <div class="box-actions">
                        <button class="btn btn-secondary" onclick="spendFromBox(${box.id})" ${isLocked ? 'disabled' : ''}>
                            <i class="fas fa-money-bill-wave"></i> ${isLocked ? 'Locked' : 'Spend'}
                        </button>
                        <button class="btn btn-danger" onclick="deleteBox(${box.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    ${isLocked ? `
                    <div class="locked-overlay">
                        <div class="lock-icon">
                            <i class="fas fa-lock"></i>
                        </div>
                    </div>
                    ` : ''}
                `;
                
                boxesList.appendChild(boxItem);
            });
        }

        // Render transactions list
        function renderTransactions() {
            transactionsList.innerHTML = '';
            
            if (userData.transactions.length === 0) {
                transactionsList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon"><i class="fas fa-receipt"></i></div>
                        <h3>No transactions yet</h3>
                        <p>Your spending history will appear here</p>
                    </div>
                `;
                return;
            }
            
            userData.transactions.slice().reverse().forEach(transaction => {
                const box = userData.boxes.find(b => b.id === transaction.boxId);
                const transactionItem = document.createElement('div');
                transactionItem.className = 'transaction-item';
                
                transactionItem.innerHTML = `
                    <div>
                        <strong>${box ? box.name : 'Unknown'}</strong>
                        <div>${transaction.description}</div>
                        <small>${transaction.date}</small>
                    </div>
                    <div class="transaction-amount spent">-R${transaction.amount.toFixed(2)}</div>
                `;
                
                transactionsList.appendChild(transactionItem);
            });
        }

        // Render quests
        function renderQuests() {
            questsList.innerHTML = '';
            
            userData.quests.forEach(quest => {
                const questItem = document.createElement('div');
                questItem.className = 'quest-item';
                
                const progressPercent = (quest.progress / quest.goal) * 100;
                
                questItem.innerHTML = `
                    <div class="quest-info">
                        <div class="quest-title">${quest.title}</div>
                        <div class="quest-description">${quest.description}</div>
                        <div class="quest-progress">
                            <div class="progress-bar" style="width: ${progressPercent}%"></div>
                        </div>
                        <div>${quest.progress}/${quest.goal} completed</div>
                    </div>
                    <div class="quest-reward">
                        <i class="fas fa-coins"></i> ${quest.reward} Points
                    </div>
                `;
                
                questsList.appendChild(questItem);
            });
        }

        // Render achievements
        function renderAchievements() {
            achievementsList.innerHTML = '';
            
            userData.achievements.forEach(achievement => {
                const achievementItem = document.createElement('div');
                achievementItem.className = 'achievement-item';
                
                achievementItem.innerHTML = `
                    <div class="achievement-icon ${achievement.earned ? 'earned' : ''}">
                        <i class="fas ${achievement.icon}"></i>
                    </div>
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                `;
                
                achievementsList.appendChild(achievementItem);
            });
        }

        // Add a new box
        function addNewBox(name, type, amount, dueDate = null, startDate = null) {
            const newBox = {
                id: userData.boxes.length + 1,
                name,
                type,
                amount,
                locked: type === 'fixed' // Fixed expenses are locked until due date
            };
            
            if (type === 'fixed') {
                newBox.dueDate = dueDate;
                // Set lock status based on due date
                const today = new Date();
                const due = new Date(dueDate);
                newBox.locked = due > today;
            } else {
                newBox.startDate = startDate;
                newBox.unlockedAmount = amount;
            }
            
            userData.boxes.push(newBox);
            updateSummary();
            renderBoxes();
            
            // Update quest progress
            updateQuestProgress('create_box', 1);
            if (type === 'weekly') {
                updateQuestProgress('create_weekly_box', 1);
            }
            
            // Check if we locked money
            if (newBox.locked) {
                updateQuestProgress('lock_money', 1);
            }
            
            saveData();
        }

        // Delete a box
        function deleteBox(boxId) {
            if (confirm("Are you sure you want to delete this box? Any allocated funds will be returned to your available balance.")) {
                const boxIndex = userData.boxes.findIndex(b => b.id === boxId);
                if (boxIndex !== -1) {
                    // Return funds to available balance
                    userData.totalBalance += userData.boxes[boxIndex].amount;
                    
                    userData.boxes.splice(boxIndex, 1);
                    updateSummary();
                    renderBoxes();
                    saveData();
                    showNotification('Box deleted successfully!');
                }
            }
        }

        // Simulate spending from a box
        function spendFromBox(boxId) {
            const box = userData.boxes.find(b => b.id === boxId);
            if (!box) return;
            
            // Check if box is locked
            if (isBoxLocked(box)) {
                showNotification('This box is locked until its due date!', 'error');
                return;
            }
            
            if (box.type === 'weekly' && box.unlockedAmount <= 0) {
                alert('No available funds in this box!');
                return;
            }
            
            const amount = parseFloat(prompt(`How much did you spend from ${box.name}?`));
            if (isNaN(amount) || amount <= 0) return;
            
            if (box.type === 'weekly') {
                if (amount > box.unlockedAmount) {
                    alert(`You only have R${box.unlockedAmount.toFixed(2)} available in this box!`);
                    return;
                }
                box.unlockedAmount -= amount;
            }
            
            // Add transaction
            const description = prompt('What was this expense for?') || 'Miscellaneous';
            const newTransaction = {
                id: userData.transactions.length + 1,
                boxId,
                amount,
                description,
                date: new Date().toISOString().split('T')[0]
            };
            
            userData.transactions.push(newTransaction);
            userData.totalBalance -= amount;
            
            updateSummary();
            renderBoxes();
            renderTransactions();
            
            // Update quest progress for successful transaction
            updateQuestProgress('successful_transactions', 1);
            
            saveData();
            showNotification('Transaction recorded successfully!');
        }

        // Update quest progress
        function updateQuestProgress(type, increment) {
            let earnedPoints = 0;
            let completedQuests = [];
            
            userData.quests.forEach(quest => {
                if (quest.type === type && !quest.completed) {
                    quest.progress += increment;
                    
                    if (quest.progress >= quest.goal) {
                        quest.completed = true;
                        quest.progress = quest.goal;
                        earnedPoints += quest.reward;
                        completedQuests.push(quest.title);
                    }
                }
            });
            
            if (earnedPoints > 0) {
                userData.points += earnedPoints;
                updateLevel();
                updateGamificationDisplay();
                renderQuests();
                
                // Show reward popup for completed quests
                if (completedQuests.length > 0) {
                    showRewardPopup(completedQuests, earnedPoints, 'quest');
                }
                
                // Check for achievements related to quest completion
                checkForAchievementProgress('complete_quests');
            }
            
            saveData();
        }

        // Check for achievement progress
        function checkForAchievementProgress(action, value = 1) {
            let earnedAchievements = [];
            
            userData.achievements.forEach(achievement => {
                if (achievement.earned) return;
                
                let earned = false;
                
                switch(achievement.id) {
                    case 1: // First Steps
                        if (action === 'set_balance' && userData.totalBalance > 0) {
                            earned = true;
                        }
                        break;
                    case 2: // Box Collector
                        if (action === 'create_box' && userData.boxes.length >= 3) {
                            earned = true;
                        }
                        break;
                    case 3: // Weekly Budgeter
                        if (action === 'create_weekly_box') {
                            earned = true;
                        }
                        break;
                    case 4: // Financial Guardian
                        if (action === 'lock_money') {
                            const lockedAmount = userData.boxes
                                .filter(box => isBoxLocked(box))
                                .reduce((sum, box) => sum + box.amount, 0);
                            if (lockedAmount >= 100) {
                                earned = true;
                            }
                        }
                        break;
                    case 5: // On Track
                        if (action === 'complete_quests') {
                            const completedQuests = userData.quests.filter(q => q.completed).length;
                            if (completedQuests >= 3) {
                                earned = true;
                            }
                        }
                        break;
                    case 6: // Savvy Spender
                        if (action === 'successful_transactions' && userData.transactions.length >= 10) {
                            earned = true;
                        }
                        break;
                    case 7: // Balance Master
                        if (userData.level >= 5) {
                            earned = true;
                        }
                        break;
                    case 8: // Financial Guru
                        if (userData.points >= 500) {
                            earned = true;
                        }
                        break;
                }
                
                if (earned) {
                    achievement.earned = true;
                    earnedAchievements.push(achievement);
                }
            });
            
            if (earnedAchievements.length > 0) {
                renderAchievements();
                
                // Show reward popup for achievements
                earnedAchievements.forEach(achievement => {
                    showRewardPopup([achievement.title], 0, 'achievement', achievement.description);
                });
                
                saveData();
            }
        }

        // Update user level based on points
        function updateLevel() {
            const newLevel = Math.floor(userData.points / 100) + 1;
            if (newLevel > userData.level) {
                userData.level = newLevel;
                showRewardPopup(['Level Up!'], 0, 'level', `You've reached Level ${newLevel}!`);
                
                // Check for level-related achievements
                checkForAchievementProgress('level_up');
            }
        }

        // Show reward popup
        function showRewardPopup(titles, points, type, description = '') {
            if (type === 'quest') {
                rewardTitle.textContent = 'Quest Completed!';
                rewardDesc.innerHTML = `You completed: <strong>${titles.join(', ')}</strong><br>Earned: <strong>${points} points</strong>`;
            } else if (type === 'achievement') {
                rewardTitle.textContent = 'Achievement Unlocked!';
                rewardDesc.innerHTML = `<strong>${titles[0]}</strong><br>${description}`;
            } else if (type === 'level') {
                rewardTitle.textContent = titles[0];
                rewardDesc.textContent = description;
            }
            
            rewardPopup.classList.add('show');
        }

        // Close reward popup
        function closeRewardPopup() {
            rewardPopup.classList.remove('show');
        }

        // Show quests section
        function showQuests() {
            questsSection.style.display = 'block';
            achievementsSection.style.display = 'none';
            
            // Scroll to quests section
            questsSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Show achievements section
        function showAchievements() {
            achievementsSection.style.display = 'block';
            questsSection.style.display = 'none';
            
            // Scroll to achievements section
            achievementsSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Finish onboarding
        function finishOnboarding() {
            onboarding.style.display = 'none';
            localStorage.setItem('brdgeBoxOnboarded', 'true');
        }

        // Initialize the app when the page loads
        window.onload = initApp;
        
        // Close modal if clicked outside
        window.onclick = function(event) {
            if (event.target === addBoxModal) {
                addBoxModal.style.display = 'none';
            }
            if (event.target === onboarding) {
                onboarding.style.display = 'none';
                localStorage.setItem('brdgeBoxOnboarded', 'true');
            }
            if (event.target === rewardPopup) {
                closeRewardPopup();
            }
        };