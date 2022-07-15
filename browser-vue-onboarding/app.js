window.addEventListener("DOMContentLoaded", () => {
    main.init();
});

const main = {
    data: ['🦈', '🦈', '🦈'],
    init() {
        this.render()
    },
    render() {
        const ulEm = document.createElement("ul")

        this.data.forEach(animal => {
            const liEm = document.createElement('li');
            const textNode = document.createTextNode(animal);

            liEm.append(textNode);
            ulEm.append(liEm);
        })

        document.body.append(ulEm);
    }
}

