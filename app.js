/**
 * UW SMART PARKING - JAVASCRIPT v2.0
 * Optimized and Organized Application Logic
 */

// ===================================
// STATE MANAGEMENT
// ===================================
const AppState = {
    currentScreen: 'onboarding-screen',
    selectedLot: null,
    selectedLotType: null,
    userLocation: { lat: 47.6553, lng: -122.3035 }, // UW Campus
    lastUpdated: new Date(),
    isFirstVisit: true
};

// ===================================
// SCREEN NAVIGATION
// ===================================
const Navigation = {
    /**
     * Show a specific screen and update navigation state
     */
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show selected screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            targetScreen.scrollTop = 0;
            AppState.currentScreen = screenId;
            
            // Update navigation bar active state
            this.updateNavBar(screenId);
            
            // Track screen view for analytics (demo)
            this.trackScreenView(screenId);
        }
    },

    /**
     * Update navigation bar active state
     */
    updateNavBar(screenId) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Map screens to nav items
        const navMapping = {
            'home-screen': 0,
            'destination-screen': 1,
            'notifications-screen': 2,
            'profile-screen': 3
        };

        const navIndex = navMapping[screenId];
        if (navIndex !== undefined) {
            const navItems = document.querySelectorAll('.nav-item');
            if (navItems[navIndex]) {
                navItems[navIndex].classList.add('active');
            }
        }
    },

    /**
     * Go back to previous screen (demo feature)
     */
    goBack() {
        const backHistory = {
            'destination-screen': 'home-screen',
            'recommendation-screen': 'home-screen',
            'navigation-screen': 'recommendation-screen',
            'lot-detail-screen': 'home-screen',
            'error-screen': 'home-screen',
            'help-screen': 'onboarding-screen'
        };

        const previousScreen = backHistory[AppState.currentScreen];
        if (previousScreen) {
            this.showScreen(previousScreen);
        }
    },

    /**
     * Track screen views (demo analytics)
     */
    trackScreenView(screenId) {
        console.log(`📊 Screen View: ${screenId} at ${new Date().toLocaleTimeString()}`);
    }
};

// ===================================
// LOT MANAGEMENT
// ===================================
const LotManager = {
    /**
     * Show confirmation modal for lot selection
     */
    showConfirmation(lotName, lotType) {
        AppState.selectedLot = lotName;
        AppState.selectedLotType = lotType;
        
        document.getElementById('modal-lot-name').textContent = lotName;
        document.getElementById('modal-lot-type').textContent = lotType;
        document.getElementById('confirmation-modal').classList.add('active');
        
        // Add analytics
        console.log(`🎯 Lot Selected: ${lotName} (${lotType})`);
    },

    /**
     * Close confirmation modal
     */
    closeModal() {
        document.getElementById('confirmation-modal').classList.remove('active');
    },

    /**
     * Confirm navigation to selected lot
     */
    confirmNavigation() {
        this.closeModal();
        Navigation.showScreen('navigation-screen');
        
        // Update navigation details
        this.updateNavigationInfo();
        
        // Simulate navigation start
        console.log(`🚗 Navigation Started to ${AppState.selectedLot}`);
    },

    /**
     * Update navigation information on screen
     */
    updateNavigationInfo() {
        const lotData = this.getLotData(AppState.selectedLot);
        
        // Update screen title
        const navTitle = document.querySelector('#navigation-screen .header h1');
        if (navTitle) {
            navTitle.textContent = `Navigation to ${AppState.selectedLot}`;
        }
    },

    /**
     * Get lot data (demo data)
     */
    getLotData(lotName) {
        const lots = {
            'W1': { spots: 78, distance: '0.7 mi', time: '3 min', type: 'Central' },
            'E1': { spots: 45, distance: '0.5 mi', time: '2 min', type: 'Central' },
            'C1': { spots: 12, distance: '0.4 mi', time: '2 min', type: 'Central' },
            'N1': { spots: 0, distance: '0.6 mi', time: '2 min', type: 'Central' },
            'S1': { spots: 8, distance: '0.5 mi', time: '2 min', type: 'Central' },
            'E5': { spots: 92, distance: '1.2 mi', time: '5 min', type: 'Peripheral' },
            'W18': { spots: 156, distance: '1.5 mi', time: '6 min', type: 'Peripheral' },
            'C7': { spots: 15, distance: '0.8 mi', time: '3 min', type: 'Central' }
        };
        
        return lots[lotName] || { spots: 0, distance: '0 mi', time: '0 min', type: 'Unknown' };
    },

    /**
     * Show error when lot is full
     */
    showErrorState() {
        Navigation.showScreen('error-screen');
        console.log('⚠️ Error: Lot became full');
    }
};

// ===================================
// TIME & DATE UTILITIES
// ===================================
const TimeUtils = {
    /**
     * Get formatted timestamp
     */
    getTimestamp() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    },

    /**
     * Get time difference in minutes
     */
    getMinutesAgo(timestamp) {
        const now = new Date();
        const diff = Math.floor((now - timestamp) / 1000 / 60);
        return diff;
    },

    /**
     * Update last updated timestamp
     */
    updateTimestamp() {
        const minutesAgo = this.getMinutesAgo(AppState.lastUpdated);
        const timeText = minutesAgo === 0 ? 'just now' : `${minutesAgo} min ago`;
        const currentTime = this.getTimestamp();
        
        const timestampElements = document.querySelectorAll('.last-updated-time');
        timestampElements.forEach(el => {
            el.textContent = `${timeText} (${currentTime})`;
        });
    }
};

// ===================================
// DEMO FEATURES
// ===================================
const DemoFeatures = {
    /**
     * Simulate real-time updates
     */
    startRealTimeUpdates() {
        // Update timestamp every 30 seconds
        setInterval(() => {
            AppState.lastUpdated = new Date();
            TimeUtils.updateTimestamp();
        }, 30000);
    },

    /**
     * Add keyboard shortcuts for demo
     */
    enableKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape key closes modal
            if (e.key === 'Escape') {
                LotManager.closeModal();
            }
            
            // Number keys for quick navigation (demo only)
            const keyMap = {
                '1': 'home-screen',
                '2': 'destination-screen',
                '3': 'recommendation-screen',
                '4': 'notifications-screen',
                '5': 'profile-screen'
            };
            
            if (keyMap[e.key]) {
                Navigation.showScreen(keyMap[e.key]);
            }
        });
    },

    /**
     * Add swipe gestures (demo simulation)
     */
    enableSwipeGestures() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        const phoneContainer = document.querySelector('.phone-container');
        
        phoneContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        phoneContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            if (touchStartX - touchEndX > swipeThreshold) {
                // Swipe left - could advance screen
                console.log('👈 Swipe left detected');
            }
            if (touchEndX - touchStartX > swipeThreshold) {
                // Swipe right - go back
                console.log('👉 Swipe right detected');
                Navigation.goBack();
            }
        };
    },

    /**
     * Log demo instructions to console
     */
    showDemoInstructions() {
        console.log(`
╔════════════════════════════════════════════════╗
║   UW SMART PARKING - DEMO MODE                ║
╠════════════════════════════════════════════════╣
║  KEYBOARD SHORTCUTS:                          ║
║  • Press 1-5 to jump between screens          ║
║  • Press ESC to close modals                  ║
║                                               ║
║  DEMO FEATURES:                               ║
║  • Real-time timestamp updates                ║
║  • Swipe gestures (mobile)                    ║
║  • Screen view analytics                      ║
║  • Lot selection tracking                     ║
╚════════════════════════════════════════════════╝
        `);
    },

    /**
     * Check if this is first visit
     */
    checkFirstVisit() {
        const hasVisited = localStorage.getItem('uw-parking-visited');
        
        if (!hasVisited) {
            // First visit - show onboarding
            AppState.isFirstVisit = true;
            Navigation.showScreen('onboarding-screen');
            localStorage.setItem('uw-parking-visited', 'true');
        } else {
            // Returning user - skip to home
            AppState.isFirstVisit = false;
            Navigation.showScreen('home-screen');
        }
    }
};

// ===================================
// EVENT LISTENERS SETUP
// ===================================
const EventListeners = {
    /**
     * Initialize all event listeners
     */
    init() {
        // Modal close on overlay click
        document.getElementById('confirmation-modal').addEventListener('click', (e) => {
            if (e.target.id === 'confirmation-modal') {
                LotManager.closeModal();
            }
        });

        // Add smooth scroll behavior
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                Navigation.showScreen(targetId);
            });
        });

        // Track clicks on parking lots
        document.querySelectorAll('.parking-lot').forEach(lot => {
            lot.addEventListener('click', function() {
                const lotName = this.textContent.split('\n')[0];
                console.log(`🅿️ Parking lot clicked: ${lotName}`);
            });
        });

        console.log('✅ Event listeners initialized');
    }
};

// ===================================
// GLOBAL FUNCTIONS (for inline onclick)
// ===================================
function showScreen(screenId) {
    Navigation.showScreen(screenId);
}

function showDestinationScreen() {
    Navigation.showScreen('destination-screen');
}

function showRecommendation() {
    Navigation.showScreen('recommendation-screen');
}

function showNavigation() {
    Navigation.showScreen('navigation-screen');
}

function showLotConfirmation(lotName, lotType) {
    LotManager.showConfirmation(lotName, lotType);
}

function showLotDetail(lotName) {
    Navigation.showScreen('lot-detail-screen');
    console.log(`📍 Viewing details for ${lotName}`);
}

function closeModal() {
    LotManager.closeModal();
}

function confirmNavigation() {
    LotManager.confirmNavigation();
}

function showErrorDemo() {
    LotManager.showErrorState();
}

function showNotifications() {
    Navigation.showScreen('notifications-screen');
}

function showProfile() {
    Navigation.showScreen('profile-screen');
}

// ===================================
// APPLICATION INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 UW Smart Parking App Initialized');
    
    // Initialize event listeners
    EventListeners.init();
    
    // Enable demo features
    DemoFeatures.startRealTimeUpdates();
    DemoFeatures.enableKeyboardShortcuts();
    DemoFeatures.enableSwipeGestures();
    DemoFeatures.showDemoInstructions();
    
    // Check if first visit and show appropriate screen
    DemoFeatures.checkFirstVisit();
    
    // Update initial timestamp
    TimeUtils.updateTimestamp();
    
    console.log('✨ App ready for demo presentation');
});

// ===================================
// EXPORT FOR DEBUGGING
// ===================================
window.UWParkingApp = {
    Navigation,
    LotManager,
    TimeUtils,
    DemoFeatures,
    AppState
};