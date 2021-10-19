const text = document.getElementById('text');
const para = "Well, I will call you darlin' and everything will be okay. 'Cause I know that I am yours and you are mine. Doesn't matter anyway. In the night, we'll take a walk, it's nothing funny. Just to talk. Put your hand in mine. You know that I want to be with you all the time. Well, I have called you darlin' and I'll say it again, again. Until I make you mine."
let peers = [];

//initialize the socket stuff
const socket = io();
socket.on("connect", () => {
    socket.emit('joinroom', {
        name: "Udit",
        room: "2",
        pos: 0
    });
});

//Getting info about the peers which are currently there
socket.on("roomUsers", data => {
    peers = data.users;
    console.log(peers);
});

//Getting position updates of peers
socket.on('positionUpdateOthers', user => {
    const idx = peers.findIndex(peer => peer.id === user.id);
    spans[peers[idx].pos].classList.remove(`${peers[idx].color}`);
    peers[idx].pos = user.pos;
    spans[peers[idx].pos].classList.add(`${peers[idx].color}`);
    console.log(peers[idx].name, peers[idx].pos);
})

//breaking the paragraph into letters and making a span for each letter
const letters = [...para];
const spans = letters.map(letter => {
    const span = document.createElement('span');
    span.innerHTML = letter;
    return span;
});

//adding the spans to text element in the document
spans.forEach(span => text.appendChild(span));
let position = 0;
spans[0].classList.add('green');


//listening for key presses and updating the position of the current letter.
document.addEventListener('keydown', e => {
    if(position === letters.length) return;
    if(e.key === letters[position]) {
        spans[position].classList.remove(`green`);
        position++;
        spans[position].classList.add(`green`);
        socket.emit('positionUpdate', {
            pos : position
        })
    }
});
