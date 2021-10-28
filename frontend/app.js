//Game 1st screen taking name and room from user
const textContainer = document.querySelector('.text-container');
const playerContainer = document.querySelector('.player-container');
const formContainer = document.querySelector('.form-container');
const resultContainer = document.querySelector('.result-container');
const playButton = document.getElementById('playButton');
const nameInput = document.getElementById('name');
const roomInput = document.getElementById('room');
let myName, myRoom, results;
//setting game stage
setGameStage(1);
function setGameStage(stage) {
    if(stage === 1) {
        textContainer.style.display = 'none';
        playerContainer.style.display = 'none';
        formContainer.style.display = 'flex';
        resultContainer.style.display = 'none';
    } else if(stage === 2) {
        textContainer.style.display = 'flex';
        playerContainer.style.display = 'flex';
        formContainer.style.display = 'none';
        resultContainer.style.display = 'none';
        loadGame();
    } else {
        textContainer.style.display = 'none';
        playerContainer.style.display = 'none';
        formContainer.style.display = 'none';
        resultContainer.style.display = 'flex';
        declareResult();
    }
}


//setting game stage to 2 on submitting username and gameID
playButton.addEventListener('click', (e) => {
    e.preventDefault();
    myName = nameInput.value;
    myRoom = roomInput.value;
    nameInput.value = '';
    roomInput.value = '';
    setGameStage(2);
});

























//Game stage 2 -> Game started
function loadGame() {
    const text = document.getElementById('text');
    const para = "I've been reading books of old. The legends and the myths. Achilles and his gold. Hercules and his gifts. Spider-Man's control. And Batman with his fists. And clearly I don't see myself upon that list";
    let peers = [];

    //initialize the socket stuff
    const socket = io();
    socket.on("connect", () => {
        socket.emit('joinroom', {
            name: myName,
            room: myRoom,
            pos: 0
        });
    });

    //Getting info about the peers which are currently there
    socket.on("roomUsers", data => {
        peers = data.users;
        //TODO display players with their colors
        playerContainer.innerHTML = peers.map(peer => {
            return (
                `<div class="player-info" style="border-left: 15px solid ${peer.color};">
                    ${peer.name}
                </div>`
            )
        }).join('');
        peers.forEach(peer => updatePosition(peer));
        console.log(peers);
    });

    //Getting position updates of peers
    socket.on('positionUpdateOthers', user => {
        updatePosition(user);
    });
    //Updating position of user
    function updatePosition(user) {
        const idx = peers.findIndex(peer => peer.id === user.id);
        spans[peers[idx].pos].classList.remove(`${peers[idx].color}`);
        peers[idx].pos = user.pos;
        spans[peers[idx].pos].classList.add(`${peers[idx].color}`);
    }

    //breaking the paragraph into letters and making a span for each letter
    const letters = [...para];
    const spans = letters.map(letter => {
        const span = document.createElement('span');
        span.innerHTML = letter;
        return span;
    });

    //adding the spans to text element in the document
    spans.forEach(span => text.appendChild(span));
    let myPosition = 0;

    //Getting color and id
    let myColor, myId;
    socket.on("yourInfo", data => {
        myColor = data.color;
        myId = data.id;
        spans[0].classList.add(myColor);
        
    });

    //listening for key presses and updating the myPosition of the current letter.
    document.addEventListener('keydown', e => {
        if(e.key === letters[myPosition]) {
            if(myPosition === letters.length - 1) {
                console.log("I have finished");
                socket.emit('finished');
                return;
            }
            spans[myPosition].classList.remove(`${myColor}`);
            myPosition++;
            spans[myPosition].classList.add(`${myColor}`);
            socket.emit('positionUpdate', {
                pos : myPosition
            })
        }
    });

    //On game finished. disconnect and load the results
    socket.on('gameOver', result => {
        socket.disconnect();
        results = result;
        setGameStage(3);
    });
}






//Game stage: 3 -> game finished
function declareResult() {
    const listItems = results.map(pinfo => {
        return `
            <li>
                ${pinfo.name} (${pinfo.pos} words).
            </li>
        `;
    }).join('');
    const rankListTitle = "<h3>RankList</h3>";
    resultContainer.innerHTML = `${rankListTitle} <ol>${listItems}</ol>`;
}