class Destination {
    setDestination(destination) {
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);
        document.cookie = `dest=${destination}; expires=${expires}; path=/`;
    }
    getDestination() {
        const found = document.cookie.split('; ')
            .find((current) => current.split('=')[0] === 'dest');
        return found ? found.split('=')[1] : null;
    }
    clearDestination() {
        document.cookie = 'dest=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
}

export default Destination;
