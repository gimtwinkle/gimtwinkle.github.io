'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { CONTACT_REPOSITORY, GUESTBOOK_PREFIX, GUESTBOOK_URL, makeGuestbookLink, makeMailLink } from './contactLinks';
import styles from './ContactPanel.module.css';

export type ContactMode = 'mail' | 'guestbook';
type Entry = { id: number; title: string; body: string | null; html_url: string; created_at: string; user: { login: string } | null; pull_request?: unknown };
let cachedEntries: Entry[] | undefined;
let cachedAt = 0;

async function getEntries(signal: AbortSignal, refresh: boolean) {
    if (!refresh && cachedEntries && Date.now() - cachedAt < 60_000) return cachedEntries;
    const response = await fetch(`https://api.github.com/repos/${CONTACT_REPOSITORY}/issues?state=open&sort=created&direction=desc&per_page=100`, {
        headers: { Accept: 'application/vnd.github+json' }, signal,
    });
    if (!response.ok) throw new Error('방명록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
    const entries: Entry[] = await response.json();
    cachedEntries = entries.filter((entry) => !entry.pull_request && entry.title.startsWith(GUESTBOOK_PREFIX));
    cachedAt = Date.now();
    return cachedEntries;
}

function GuestbookEntries() {
    const [entries, setEntries] = useState<Entry[]>(cachedEntries ?? []);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [revision, setRevision] = useState(0);
    useEffect(() => {
        const controller = new AbortController();
        getEntries(controller.signal, revision > 0).then((result) => {
            if (!controller.signal.aborted) { setEntries(result); setLoading(false); }
        }).catch((reason) => {
            if (!controller.signal.aborted) { setError(reason instanceof Error ? reason.message : '방명록을 불러오지 못했어요.'); setLoading(false); }
        });
        return () => controller.abort();
    }, [revision]);
    return <section className={styles.entries} aria-label="방문자들의 방명록">
        <div className={styles.entriesHeading}><h3>마을에 남겨진 발자국</h3><button type="button" disabled={loading} onClick={() => { setLoading(true); setError(''); setRevision(revision + 1); }}>새로고침 ↻</button></div>
        {loading && <p role="status" className={styles.note}>편지를 꺼내오는 중...</p>}
        {error && <p role="alert" className={styles.note}>{error}</p>}
        {!loading && !error && entries.length === 0 && <div className={styles.empty}><span aria-hidden="true">✧</span><p>아직 발자국이 없어요.<br />첫 번째 인사를 남겨 주세요!</p></div>}
        {entries.slice(0, 12).map((entry) => <article key={entry.id} className={styles.entry}>
            <header><strong>{entry.user ? `@${entry.user.login}` : '마을 방문자'}</strong><time dateTime={entry.created_at}>{new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', dateStyle: 'medium' }).format(new Date(entry.created_at))}</time></header>
            <p>{(entry.body ?? '').split('\n---\n')[0].slice(0, 700)}</p>
            <a href={entry.html_url} target="_blank" rel="noopener noreferrer">원문과 답글 보기 ↗</a>
        </article>)}
        <a className={styles.textLink} href={GUESTBOOK_URL} target="_blank" rel="noopener noreferrer">GitHub에서 모든 방명록 보기 ↗</a>
    </section>;
}

export default function ContactPanel({ mode: initialMode, onClose }: { mode: ContactMode; onClose: () => void }) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [mode, setMode] = useState(initialMode);
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('twinkle에게 보내는 편지');
    const [messages, setMessages] = useState({ mail: '', guestbook: '' });
    const message = messages[mode];
    const [mailOpened, setMailOpened] = useState(false);
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        const previous = document.activeElement as HTMLElement | null;
        const dialog = dialogRef.current;
        dialog?.showModal();
        return () => { dialog?.close(); previous?.focus(); };
    }, []);
    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!message.trim()) {
            const field = event.currentTarget.querySelector('textarea');
            field?.setCustomValidity('내용을 적어 주세요.');
            field?.reportValidity();
            return;
        }
        if (mode === 'mail') { window.location.href = makeMailLink(name, subject, message); setMailOpened(true); }
        else window.open(makeGuestbookLink(name, message), '_blank', 'noopener,noreferrer');
    };
    return createPortal(<dialog ref={dialogRef} className={styles.dialog} aria-labelledby="contact-letter-title"
        onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
        onKeyDown={(event) => event.stopPropagation()} onKeyUp={(event) => event.stopPropagation()}>
        <div className={styles.paper}>
            <header className={styles.header}><span>TWINKLE POST OFFICE · LETTERS &amp; LITTLE HELLOS</span><button type="button" onClick={onClose} aria-label="편지 창 닫기">×</button></header>
            <div className={styles.intro}><div><p className={styles.eyebrow}>A LITTLE HELLO GOES A LONG WAY</p><h2 id="contact-letter-title">{mode === 'mail' ? 'twinkle에게 보내는 편지' : '당신의 발자국을 남겨 주세요'}</h2><p>{mode === 'mail' ? '함께 만들고 싶은 것, 궁금한 이야기, 가벼운 인사도 좋아요.' : '이 작은 마을에 들렀다는 흔적, 오래 간직할게요.'}</p></div><div className={styles.stamp} aria-hidden="true">✦<small>WITH LOVE</small></div></div>
            <nav className={styles.tabs} aria-label="연락 방법"><button type="button" aria-pressed={mode === 'mail'} onClick={() => setMode('mail')}>✉ 개인 편지</button><button type="button" aria-pressed={mode === 'guestbook'} onClick={() => setMode('guestbook')}>✎ 공개 방명록</button></nav>
            <div className={mode === 'guestbook' ? styles.columns : undefined}>
                <form onSubmit={submit} className={styles.form}>
                    <label>FROM · 보내는 분<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="어떤 이름으로 기억할까요?" maxLength={40} /></label>
                    {mode === 'mail' && <><p className={styles.recipient}>TO · twinkle</p><label>SUBJECT · 제목<input value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={120} required /></label></>}
                    <label>{mode === 'mail' ? 'LETTER · 전하고 싶은 이야기' : 'MESSAGE · 남기고 싶은 한마디'}<textarea value={message} onChange={(event) => { event.target.setCustomValidity(''); const value = event.target.value; setMessages((current) => ({ ...current, [mode]: value })); }} placeholder="안녕, twinkle!" maxLength={mode === 'mail' ? 1500 : 700} rows={7} required /></label>
                    <div className={styles.formFooter}><span>{message.length} / {mode === 'mail' ? 1500 : 700}</span><button className={styles.send} type="submit">{mode === 'mail' ? '메일 앱에서 보내기 ↗' : 'GitHub에서 등록하기 ↗'}</button></div>
                    <p className={styles.note}>{mode === 'mail' ? '메일 앱이 열리면 내용을 확인하고 전송해 주세요.' : 'GitHub 로그인 후 새 창에서 등록을 완료해 주세요. 작성한 글은 공개되며, 등록 후 새로고침하면 여기에 표시돼요.'}</p>
                    {mode === 'mail' && <div className={styles.copyRow}><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(`${subject}\n\n${message}`); setCopied(true); } catch { setCopied(false); } }}>{copied ? '복사했어요 ✓' : '편지 내용 복사'}</button>{mailOpened && <p role="status">앱이 열리지 않으면 복사해서 보내 주세요.</p>}</div>}
                </form>
                {mode === 'guestbook' && <GuestbookEntries />}
            </div>
            <footer className={styles.footer}>SENT FROM A SMALL VILLAGE, WITH A BIG HEART. <span aria-hidden="true">♡</span></footer>
        </div>
    </dialog>, document.body);
}
