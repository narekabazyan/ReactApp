class CacheManager {

    version = localStorage.getItem('version');

    setVersion(version) {
        if (!this.version || version !== this.version) {
            localStorage.clear();
            localStorage.setItem('version', version);
            window.location.reload();
        }
    }
}

export default new CacheManager();