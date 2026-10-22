export const CONTACT_EMAIL = 'beingnami2023@gmail.com';
export const CONTACT_REPOSITORY = 'gimtwinkle/gimtwinkle.github.io';
export const GUESTBOOK_PREFIX = '[방명록]';
export const GUESTBOOK_URL = `https://github.com/${CONTACT_REPOSITORY}/issues?q=${encodeURIComponent('is:issue is:open "[방명록]"')}`;

export function makeMailLink(name: string, subject: string, message: string) {
    const body = `${message.trim()}\n\n보낸 사람: ${name.trim() || '마을 방문자'}`;
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject.trim() || 'twinkle에게 보내는 편지')}&body=${encodeURIComponent(body)}`;
}

export function makeGuestbookLink(name: string, message: string) {
    const query = new URLSearchParams({
        title: `${GUESTBOOK_PREFIX} ${name.trim() || '마을 방문자'}의 발자국`,
        body: `${message.trim()}\n\n---\nTwinkle Village에서 남긴 방명록`,
    });
    return `https://github.com/${CONTACT_REPOSITORY}/issues/new?${query}`;
}
