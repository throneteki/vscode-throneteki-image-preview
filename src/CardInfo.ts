export class CardInfo {
    static parseFromFile(text: string): CardInfo | null {
        let match = text.match(/(\w+)\.(code|id) = '(\d{5}|(\w|-)+)'/);
        if (!match) {
            return null;
        }
        let site = match[2] === 'id' ? 'ringteki' : 'throneteki';
        return new CardInfo(site, match[1], match[3]);
    }
    site: string;
    name: string;
    code: string;
    constructor(site: string, name: string, code: string) {
        this.site = site;
        this.name = name;
        this.code = code;
    }
    get imageUrl(): string {
        if (this.site === 'ringteki') {
            return `https://jigoku.online/img/cards/${this.code}.jpg`;
        }
        return `https://throneteki.net/img/cards/${this.code}.png`;
    }
}
