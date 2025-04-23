export const UIManager = (() => {
    return {
        showBuildMenu(slotId, allowedBuildings) {
            // Implementation for build menu popup
            console.log(`Show build menu for slot ${slotId}`);
        },

        toggleLeftMenu() {
            document.getElementById('left-menu').classList.toggle('collapsed');
        }
    };
})();