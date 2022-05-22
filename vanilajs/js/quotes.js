const quotes = [
    {
        quote: '역경을 이겨내고 피어난 꽃이 가장 아름답다',
        author: '- 뮬란, 파 주 - '
    },
    {
        quote: '좋은 말을 해주지 않을 거면 차라리 아무 말도 하지 마',
        author: '- 밤비, 덤퍼 -'
    },
    {
        quote: '과거는 상관없어. 물론 아프긴 하겠지. 하지만 둘 중 하나야, 도망치든가 극복하든가',
        author: '- 라이온킹, 라피키 -'
    },
    {
        quote: '안전지대를 벗어나 모험을 해봐. 그에 대한 보상은 분명 가치 있을 거야',
        author: '- 라푼젤, 라푼젤 -'
    },
    {
        quote: '사는 게 힘들면 어떻게 하는 줄 알아? 그냥 계속 헤엄쳐!',
        author: '- 니모를 찾아서, 도리 -'
    },
    {
        quote: '가끔은 가장 옳은 길이 가장 쉬운 길이 아닐 때도 있지',
        author: '- 포카혼타스, 버드나무 할머니 -'
    },
    {
        quote: '아무리 마음이 슬퍼도 계속해서 믿는다면 바라는 꿈이 이루어질 거야',
        author: '- 신데렐라, 신데렐라 -'
    },
    {
        quote: '사랑은 누군가를 너보다 먼저 두는 거야',
        author: '- 겨울왕국, 올라프 -'
    },
    {
        quote: '넌 네가 믿는 것보다 더 용감하고, 보기보다 강하고, 네 생각보다 훨씬 똑똑해',
        author: '- 위니 더 푸, 크리스토퍼 로빈 -'
    },
    {
        quote: '매일 행복하진 않지만 행복한 일은 매일 있어.',
        author: '- 위니 더 푸, 푸 -'
    },
];

const quote = document.querySelector("#quote span:first-child");
const author = document.querySelector("#quote span:last-child");

const todaysQuote = quotes[Math.floor(Math.random() * quotes.length)];

quote.innerText = todaysQuote.quote;
author.innerText = todaysQuote.author;
