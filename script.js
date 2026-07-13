
	const titleScreen =
	  document.getElementById(
	    "titleScreen"
	  );

	const gameScreen =
	  document.getElementById(
	    "gameScreen"
	  );

    const settingsButton =
	  document.getElementById(
	    "settingsButton"
	  );

	const settingsModal =
	  document.getElementById(
	    "settingsModal"
	  );

	const closeSettings =
	  document.getElementById(
	    "closeSettings"
	  );

	settingsButton.addEventListener(
	  "click",
	  () => {

	    settingsModal.style.display =
	      "flex";

	  }
	);

	closeSettings.addEventListener(
	  "click",
	  () => {

	    settingsModal.style.display =
	      "none";

	  }
	);

	const volumeSlider =
	  document.getElementById(
	    "volumeSlider"
	  );

	const volumeValue =
	  document.getElementById(
	    "volumeValue"
	  );

		document
	  .querySelectorAll(
	    ".difficulty-btn"
	  )
	  .forEach(button => {

	    button.addEventListener(
	      "click",
	      () => {

        aiLevel =
          button.dataset.level;

	 document
          .querySelectorAll(
            ".difficulty-btn"
          )
          .forEach(b =>
            b.classList.remove(
              "selected-difficulty"
            )
          );

        button.classList.add(
          "selected-difficulty"
        );

        titleScreen.style.display =
          "none";

        gameScreen.style.display =
          "flex";

        gameMode = "ai";

        console.log(
          "難易度:",
          aiLevel
        );

        let startingSide = turnOrder;

        if (startingSide === "random") {

          startingSide =
            Math.random() < 0.5
              ? "first"
              : "second";

        }

        if (startingSide === "second") {

          currentPlayer = "×";

          statusText.textContent =
            currentPlayer + " の番";

          isAiThinking = true;

          setTimeout(() => {

            aiMove();

            isAiThinking = false;

          }, 500);

        }

      }
    );

	});

	document
	  .querySelectorAll(
	    ".turn-order-btn"
	  )
	  .forEach(button => {

	    button.addEventListener(
	      "click",
	      () => {

        turnOrder =
          button.dataset.order;

	 document
          .querySelectorAll(
            ".turn-order-btn"
          )
          .forEach(b =>
            b.classList.remove(
              "selected-turn-order"
            )
          );

        button.classList.add(
          "selected-turn-order"
        );

      }
    );

	});

	document
	  .getElementById("multiBtn")
	  .addEventListener("click", () => {

	    titleScreen.style.display =
	      "none";

	    gameScreen.style.display =
	      "flex";
	});

    const bigBoard = document.getElementById("bigBoard");
    const statusText = document.getElementById("status");
    const resetButton =
      document.getElementById("resetButton");

	// リセット
	resetButton.addEventListener("click", () => {

	  location.reload();

	});

	const ruleBtn =
	  document.getElementById(
	    "ruleBtn"
	  );

	const difficultyButtons =
	  document.querySelectorAll(
	    ".difficulty-btn"
	  );

	difficultyButtons.forEach(btn => {

	  btn.addEventListener(
	    "click",
	    () => {

	      aiLevel =
	        btn.dataset.level;

console.log(
        "難易度:",
        aiLevel
      );
	    }
	  );

	});

	const ruleModal =
	  document.getElementById(
	    "ruleModal"
	  );

	const closeRuleBtn =
	  document.getElementById(
	    "closeRuleBtn"
	  );

	ruleBtn.addEventListener(
	  "click",
	  () => {

	    ruleModal.style.display =
	      "flex";

	  }
	);

	closeRuleBtn.addEventListener(
	  "click",
	  () => {

	    ruleModal.style.display =
	      "none";

	  }
	);

	ruleModal.addEventListener(
	  "click",
	  (e) => {

	    if (
	      e.target === ruleModal
	    ) {

	      ruleModal.style.display =
	        "none";

	    }

	  }
	);

    const savedVolume =
	  localStorage.getItem(
	    "volume"
	  );

	let masterVolume =
	  savedVolume !== null
	    ? Number(savedVolume)
	    : 0.5;

	const audioContext = new (window.AudioContext || window.webkitAudioContext)();

	const masterGain = audioContext.createGain();
	masterGain.connect(audioContext.destination);
	masterGain.gain.value = masterVolume;

	const soundBuffers = {
	  click: null,
	  place: null,
	  smallWin: null,
	  bigWin: null,
	};

	async function loadSound(name, url) {

	  const response = await fetch(url);
	  const arrayBuffer = await response.arrayBuffer();
	  soundBuffers[name] = await audioContext.decodeAudioData(arrayBuffer);

	}

	loadSound("click", "click.mp3");
	loadSound("place", "place.mp3");
	loadSound("smallWin", "smallwin.mp3");
	loadSound("bigWin", "bigwin.mp3");

	function playSound(name) {

	  const buffer = soundBuffers[name];

	  if (!buffer) {
	    return;
	  }

	  const source = audioContext.createBufferSource();
	  source.buffer = buffer;
	  source.connect(masterGain);
	  source.start(0);

	}

	function unlockAudioContext() {

	  if (audioContext.state === "suspended") {
	    audioContext.resume();
	  }

	}

document
  .querySelectorAll("button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        unlockAudioContext();

        playSound("click");

      }
    );

});

    let currentPlayer = "〇";

    let gameMode = "pvp";

    let aiLevel = "normal";

    // AI対戦の先攻/後攻設定 ("first" | "second" | "random")
    let turnOrder = "first";

    let gameOver = false;

    // AI対戦時、プレイヤーの着手からAIの着手完了までの
    // 入力を防ぐためのロックフラグ
    let isAiThinking = false;

	function applyVolume() {

	  masterGain.gain.value = masterVolume;

	}

	volumeSlider.value =
	  masterVolume * 100;

	volumeValue.textContent =
	  Math.round(
	    masterVolume * 100
	  );

		volumeSlider.addEventListener(
	  "input",
	  () => {

	    masterVolume =
	      volumeSlider.value / 100;

	    volumeValue.textContent =
	      volumeSlider.value;

	    localStorage.setItem(
	      "volume",
	      masterVolume
	    );

	    applyVolume();

	  }
	);

		function checkFullDraw() {

	  if (gameOver) {
	    return;
	  }

	  const boards =
	    document.querySelectorAll(
	      ".small-board"
	    );

	  let finished = true;

	  boards.forEach(board => {

	    if (
	      !board.classList.contains("won") &&
	      !board.classList.contains("draw-board")
	    ) {

	      finished = false;

	    }

	  });

	  if (finished) {

	    gameOver = true;

	    winMessage.textContent =
	      "🤝 引き分け！";

	    winModal.style.display =
	      "flex";

	  }

	}

	const winModal =
	  document.getElementById(
	    "winModal"
	  );

	const winMessage =
	  document.getElementById(
	    "winMessage"
	  );

	const backTitleBtn =
	  document.getElementById(
	    "backTitleBtn"
	  );

    // 大きい盤面の勝者保存
    const bigBoardState = [
      "", "", "",
      "", "", "",
      "", "", ""
    ];

    const winPatterns = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ];

    // 小さい盤面を9個作る
    for (let i = 0; i < 9; i++) {

      const smallBoard = document.createElement("div");
      smallBoard.classList.add("small-board");

      const cells = [];

      // 小さいマスを9個作る
      for (let j = 0; j < 9; j++) {

        const cell = document.createElement("div");
        cell.classList.add("cell");

	cell.boardIndex = i;
	cell.cellIndex = j;

        cells.push(cell);

       cell.addEventListener("click", () => {

  	if (isAiThinking) {
  	  return;
  	}

  	unlockAudioContext();

  	if (cell.innerHTML !== "") {
  	  return;
  	}

  	makeMove(
  	  cell,
  	  currentPlayer
  	);

  	// アニメ終了後に削除
  	setTimeout(() => {

  	  cell.classList.remove(
  	    "chalk-animation"
  	  );

	  }, 250);

	  if (currentPlayer === "〇") {
	    cell.style.color = "blue";
	  } else {
	    cell.style.color = "red";
	  }

	  checkSmallBoardWinner(
	    cells,
	    smallBoard,
	    i
	  );

	if (gameOver) {
	  return;
	}

	  currentPlayer =
	    currentPlayer === "〇"
	      ? "×"
	      : "〇";

	  statusText.textContent =
	    currentPlayer + " の番";

	  if (
	    gameMode === "ai" &&
	    currentPlayer === "×"
	  ) {

	    isAiThinking = true;

	    setTimeout(() => {

	      aiMove();

	      isAiThinking = false;

	    }, 500);

	  }

	});

        smallBoard.appendChild(cell);
      }

      bigBoard.appendChild(smallBoard);
    }

    // 小さい盤面勝利判定
    function checkSmallBoardWinner(
      cells,
      smallBoard,
      boardIndex
    ) {

      for (let pattern of winPatterns) {

        const [a, b, c] = pattern;

        if (
	  cells[a].dataset.player &&
	  cells[a].dataset.player === cells[b].dataset.player &&
	  cells[a].dataset.player === cells[c].dataset.player
	) {

          const winner =
            cells[a].dataset.player;

          smallBoard.classList.add("won");

	playSound("smallWin");

          const winnerText =
            document.createElement("div");

          winnerText.classList.add("winner-text");

          if (winner === "〇") {

	  winnerText.innerHTML = `

	    <svg viewBox="0 0 160 160">

	      <circle
	        cx="80"
	        cy="80"
	        r="55"

	        stroke="skyblue"
	        stroke-width="8"

	        fill="none"

	        class="draw-circle"
	      />

	    </svg>
	  `;

	} else {

	  winnerText.innerHTML = `

	    <svg viewBox="0 0 160 160">

	      <!-- 1本目 -->
	      <line
	        x1="30"
	        y1="30"
	        x2="130"
	        y2="130"

	        stroke="tomato"
	        stroke-width="8"

	        class="draw-line"
	      />

	      <!-- 2本目 -->
	      <line
	        x1="130"
	        y1="30"
	        x2="30"
	        y2="130"

	        stroke="tomato"
	        stroke-width="8"

	        class="draw-line delay"
	      />

	    </svg>
	  `;

	}

          smallBoard.appendChild(winnerText);

          // 大きい盤面記録
          bigBoardState[boardIndex] = winner;

          // 大きい盤面勝利判定
          checkBigBoardWinner();

	checkFullDraw();

          return;
        }
      }
	// 引き分け判定
	let isDraw = true;

	for (let cell of cells) {

	  if (!cell.dataset.player) {
	    isDraw = false;
	  }

	}

	if (isDraw) {

	  smallBoard.classList.add("draw-board");

	  checkFullDraw();

	}
    }

	function makeMove(cell, player) {

	  if (cell.innerHTML !== "") {
	    return false;
	  }

	  cell.dataset.player = player;

	  if (player === "〇") {

	playSound("place");

	    cell.innerHTML = `
	      <svg viewBox="0 0 50 50">
	        <circle
	          cx="25"
	          cy="25"
	          r="18"
	          stroke="skyblue"
	          stroke-width="4"
	          fill="none"
	          class="draw-circle"
	        />
	      </svg>
	    `;

	  } else {

	playSound("place");

	    setTimeout(() => {

		  playSound("place");

	    }, 150);

	    cell.innerHTML = `
	      <svg viewBox="0 0 50 50">
	        <line
	          x1="10"
	          y1="10"
	          x2="40"
	          y2="40"
	          stroke="tomato"
	          stroke-width="4"
	          class="draw-line"
	        />

	        <line
	          x1="40"
	          y1="10"
	          x2="10"
	          y2="40"
	          stroke="tomato"
	          stroke-width="4"
	          class="draw-line delay"
	        />
	      </svg>
	    `;
	  }
	return true;
	}

	function aiPlace(cell) {

 	 makeMove(cell, "×");

 	 const smallBoard =
 	   cell.closest(".small-board");

 	 const cells =
 	   Array.from(
 	     smallBoard.querySelectorAll(".cell")
	    );

	  checkSmallBoardWinner(
	    cells,
	    smallBoard,
	    cell.boardIndex
	  );

	if (gameOver) {
	  return;
	}

	  currentPlayer = "〇";

	  statusText.textContent =
	    currentPlayer + " の番";

	}

	function countThreats(boardCells) {

	  let threats = 0;

	  for (let pattern of winPatterns) {

	    const [a,b,c] = pattern;

	    const line = [
	      boardCells[a],
	      boardCells[b],
	      boardCells[c]
	    ];

	    const aiCount =
	      line.filter(
	        cell =>
	          cell.dataset.player === "×"
	      ).length;

	    const emptyCount =
	      line.filter(
	        cell =>
	          !cell.dataset.player
	      ).length;

	    if (
	      aiCount === 2 &&
	      emptyCount === 1
	    ) {
	      threats++;
	    }

	  }

	  return threats;

	}

    // 大きい盤面勝利判定
    function checkBigBoardWinner() {

      for (let pattern of winPatterns) {

        const [a, b, c] = pattern;

        if (
          bigBoardState[a] &&
          bigBoardState[a] === bigBoardState[b] &&
          bigBoardState[a] === bigBoardState[c]
        ) {

        statusText.textContent =
	  "🏆 " +
	  bigBoardState[a] +
	  " の完全勝利！！";

	winMessage.textContent =
	  "🏆 " +
	  bigBoardState[a] +
	  " の完全勝利！！";

	if (bigBoardState[a] === "〇") {

	  winContent.classList.add(
	    "blue-win"
	  );

	} else {

	  winContent.classList.add(
	    "red-win"
	  );

	}

	statusText.style.visibility =
  	  "hidden";

	resetButton.style.visibility =
	  "hidden";

	winModal.style.display =
	  "flex";

	confetti({

	  particleCount: 100,

	  angle: 60,

	  spread: 80,

	  origin: {
	    x: 0
	  }

	});

	confetti({

	  particleCount: 100,

	  angle: 120,

	  spread: 80,

	  origin: {
	    x: 1
	  }

	});

	gameOver = true;

	playSound("bigWin");

	// 勝利した小さい盤面を取得
	const boards =
	  document.querySelectorAll(".small-board");

	// 発光
	boards[a].classList.add("win-cell");
	boards[b].classList.add("win-cell");
	boards[c].classList.add("win-cell");


	// 勝利ライン作成
	const line =
	  document.createElement("div");

	const boardRect = bigBoard.getBoundingClientRect();

	const scaleX = boardRect.width / 650;

	const scaleY = boardRect.height / 626;

	const isMobile = window.innerWidth <= 768;

	line.classList.add("win-line");

	// 上横
	if (a === 0 && b === 1 && c === 2) {

	  const boards =
	    document.querySelectorAll(".small-board");

	  const leftRect =
	    boards[0].getBoundingClientRect();

	  const rightRect =
	    boards[2].getBoundingClientRect();

	  const layerRect =
 	 document.querySelector("#winLineLayer")
 	   .getBoundingClientRect();

	line.style.left =
	  (
	    leftRect.left
	    - layerRect.left
	  ) + "px";

	line.style.top =
	  (
	    leftRect.top
	    - layerRect.top
	    + leftRect.height / 2 - 10
	  ) + "px";

	  line.style.width =
	    (rightRect.right - leftRect.left) + "px";

	  line.style.animation = "none";
	}

	// 真ん中横
	if (a === 3 && b === 4 && c === 5) {

	  const boards =
	    document.querySelectorAll(".small-board");

	  const leftRect =
	    boards[3].getBoundingClientRect();

	  const rightRect =
	    boards[5].getBoundingClientRect();

	  const layerRect =
	    document.querySelector("#winLineLayer")
	      .getBoundingClientRect();

	  line.style.left =
	    (leftRect.left - layerRect.left) + "px";

	  line.style.top =
	    (
	      leftRect.top
	      - layerRect.top
	      + leftRect.height / 2 - 10
	    ) + "px";

	  line.style.width =
	    (rightRect.right - leftRect.left) + "px";

	  line.style.animation = "none";
	}

	// 下横
	if (a === 6 && b === 7 && c === 8) {

	  const boards =
	    document.querySelectorAll(".small-board");

	  const leftRect =
	    boards[6].getBoundingClientRect();

	  const rightRect =
	    boards[8].getBoundingClientRect();

	  const layerRect =
	    document.querySelector("#winLineLayer")
	      .getBoundingClientRect();

	  line.style.left =
	    (leftRect.left - layerRect.left) + "px";

	  line.style.top =
	    (
	      leftRect.top
	      - layerRect.top
	      + leftRect.height / 2 - 10
	    ) + "px";

	  line.style.width =
	    (rightRect.right - leftRect.left) + "px";

	  line.style.animation = "none";
	}

	// 左縦
	if (a === 0 && b === 3 && c === 6) {

	  const boards =
	    document.querySelectorAll(".small-board");

	  const topRect =
	    boards[0].getBoundingClientRect();

	  const bottomRect =
	    boards[6].getBoundingClientRect();

	  const layerRect =
	    document.querySelector("#winLineLayer")
	      .getBoundingClientRect();

	  line.style.width = "20px";
	  line.style.height = "0px";

	  line.style.left =
	    (
	      topRect.left
	      - layerRect.left
	      + topRect.width / 2 - 10
	    ) + "px";

	  line.style.top =
	    (topRect.top - layerRect.top) + "px";

	  line.style.height =
	    (bottomRect.bottom - topRect.top) + "px";

	  line.style.animation = "none";
	}

	// 真ん中縦
	if (a === 1 && b === 4 && c === 7) {

	  const boards =
	    document.querySelectorAll(".small-board");

	  const topRect =
	    boards[1].getBoundingClientRect();

	  const bottomRect =
	    boards[7].getBoundingClientRect();

	  const layerRect =
	    document.querySelector("#winLineLayer")
	      .getBoundingClientRect();

	  line.style.width = "20px";
	  line.style.height = "0px";

	  line.style.left =
	    (
	      topRect.left
	      - layerRect.left
	      + topRect.width / 2 - 10
	    ) + "px";

	  line.style.top =
	    (topRect.top - layerRect.top) + "px";

	  if (window.innerWidth <= 768) {

	    line.style.height =
	      (bottomRect.bottom - topRect.top) + "px";

	  } else {

	    line.style.height =
	      (bottomRect.bottom - topRect.top) + "px";

	  }

	  line.style.animation = "none";
	}

	// 右縦
	if (a === 2 && b === 5 && c === 8) {

	  const boards =
	    document.querySelectorAll(".small-board");

	  const topRect =
	    boards[2].getBoundingClientRect();

	  const bottomRect =
	    boards[8].getBoundingClientRect();

	  const layerRect =
	    document.querySelector("#winLineLayer")
	      .getBoundingClientRect();

	  line.style.width = "20px";
	  line.style.height = "0px";

	  line.style.left =
	    (
	      topRect.left
	      - layerRect.left
	      + topRect.width / 2 - 10
	    ) + "px";

	  line.style.top =
	    (topRect.top - layerRect.top) + "px";

	  line.style.height =
	    (bottomRect.bottom - topRect.top) + "px";

	  line.style.animation = "none";
	}

	// 斜め \
	if (a === 0 && b === 4 && c === 8) {

	  const boards =
	    document.querySelectorAll(".small-board");

	  const startRect =
	    boards[0].getBoundingClientRect();

	  const endRect =
	    boards[8].getBoundingClientRect();

	  const layerRect =
	    document.querySelector("#winLineLayer")
	      .getBoundingClientRect();

	  const startX =
	    startRect.left - layerRect.left;

	  const startY =
	    startRect.top - layerRect.top;

	  const endX =
	    endRect.right - layerRect.left;

	  const endY =
	    endRect.bottom - layerRect.top;

	  const length =
	    Math.sqrt(
	      Math.pow(endX - startX, 2) +
	      Math.pow(endY - startY, 2)
	    );

	  line.style.left =
	     startX + "px";

	  line.style.top =
	    (startY - 10) + "px";

	  line.style.width =
	    length + "px";

	  line.style.transform =
	    "rotate(46.5deg)";

	  line.style.animation = "none";
	}

	// 斜め /
	if (a === 2 && b === 4 && c === 6) {

	  const boards =
	    document.querySelectorAll(".small-board");

	  const startRect =
	    boards[2].getBoundingClientRect();

	  const endRect =
	    boards[6].getBoundingClientRect();

	  const layerRect =
	    document.querySelector("#winLineLayer")
	      .getBoundingClientRect();

	  const startX =
	    startRect.right - layerRect.left;

	  const startY =
	    startRect.top - layerRect.top;

	  const endX =
	    endRect.left - layerRect.left;

	  const endY =
	    endRect.bottom - layerRect.top;

	  const length =
	    Math.sqrt(
	      Math.pow(startX - endX, 2) +
	      Math.pow(endY - startY, 2)
	    );

	  line.style.left =
	     startX + "px";

	  line.style.top =
	    (startY - 10) + "px";

	  line.style.width =
	    length + "px";

	  line.style.transform =
	    "rotate(134deg)";

	  line.style.animation = "none";
	}

	document
	  .querySelector("#winLineLayer")
	  .appendChild(line);

          // 全盤面クリック禁止
          document
            .querySelectorAll(".small-board")
            .forEach(board => {
              board.style.pointerEvents = "none";
            });

          // 勝者色変更
          document
            .querySelectorAll(".winner-text")
            .forEach(text => {
              text.classList.add("big-winner");
            });

          return;
        }
      }
    }

	function aiMoveEasy() {

	  const boards =
	    document.querySelectorAll(".small-board");

	  const cells =
	    document.querySelectorAll(".cell");

	  const emptyCells = [];

	  cells.forEach(cell => {

	    if (
	      cell.innerHTML === "" &&
	      !cell.closest(".won")
	    ) {
	      emptyCells.push(cell);
	    }

	  });

	  if (emptyCells.length === 0) {
	    return;
	  }

	  // 小盤面内で指定プレイヤーが即座に揃えられるマスを探す
	  // (Easy専用: その場で完成する手だけを見る簡易チェックで、
	  //  先読みやフォークの検出は行わない)
	  function findImmediateWin(player) {

	    for (let board of boards) {

	      if (
	        board.classList.contains("won") ||
	        board.classList.contains("draw-board")
	      ) {
	        continue;
	      }

	      const boardCells =
	        board.querySelectorAll(".cell");

	      for (let pattern of winPatterns) {

	        const [a, b, c] = pattern;

	        const line = [
	          boardCells[a],
	          boardCells[b],
	          boardCells[c]
	        ];

	        const playerCount =
	          line.filter(
	            cell => cell.dataset.player === player
	          ).length;

	        const emptyCell =
	          line.find(
	            cell => !cell.dataset.player
	          );

	        if (playerCount === 2 && emptyCell) {
	          return emptyCell;
	        }

	      }

	    }

	    return null;

	  }

	  // 簡単さを保つため、勝ち・防御に必ず気づくわけではなく
	  // ある程度の確率でしか気づかないようにする
	  const noticeChance = 0.8;

	  if (Math.random() < noticeChance) {

	    const winningCell = findImmediateWin("×");

	    if (winningCell) {
	      aiPlace(winningCell);
	      return;
	    }

	  }

	  if (Math.random() < noticeChance) {

	    const blockingCell = findImmediateWin("〇");

	    if (blockingCell) {
	      aiPlace(blockingCell);
	      return;
	    }

	  }

	  const randomCell =
	    emptyCells[
	      Math.floor(
	        Math.random() *
	        emptyCells.length
	      )
	    ];

	  aiPlace(randomCell);

	}

	// ======================
	// Hard専用 評価関数
	// (実在するルールのみを対象に評価する)
	// ======================

	// 盤面内の位置の重み(中央 > 角 > 辺)
	// 小盤面内のマス番号にも、大盤面内の盤番号にも
	// 同じ並び(0〜8)なので使い回せる
	const POSITION_WEIGHTS = [
	  2, 1, 2,
	  1, 3, 1,
	  2, 1, 2
	];

	// 指定プレイヤーのリーチ数(2個並び+空き1)を数える
	function countReachForPlayer(boardCells, player) {

	  let count = 0;

	  for (let pattern of winPatterns) {

	    const [a, b, c] = pattern;

	    const line = [
	      boardCells[a],
	      boardCells[b],
	      boardCells[c]
	    ];

	    const playerCount =
	      line.filter(
	        cell => cell.dataset.player === player
	      ).length;

	    const emptyCount =
	      line.filter(
	        cell => !cell.dataset.player
	      ).length;

	    if (playerCount === 2 && emptyCount === 1) {
	      count++;
	    }

	  }

	  return count;

	}

	// 指定プレイヤーの育成中のライン数(1個+空き2)を数える
	function countBuildingForPlayer(boardCells, player) {

	  let count = 0;

	  for (let pattern of winPatterns) {

	    const [a, b, c] = pattern;

	    const line = [
	      boardCells[a],
	      boardCells[b],
	      boardCells[c]
	    ];

	    const playerCount =
	      line.filter(
	        cell => cell.dataset.player === player
	      ).length;

	    const emptyCount =
	      line.filter(
	        cell => !cell.dataset.player
	      ).length;

	    if (playerCount === 1 && emptyCount === 2) {
	      count++;
	    }

	  }

	  return count;

	}

	// 小盤面内でのマスの位置評価
	function evaluateSmallBoardPosition(cellIndex) {

	  return POSITION_WEIGHTS[cellIndex];

	}

	// 大盤面内でのその小盤面の位置評価
	// (勝敗が決した盤は戦略的価値が無いので0)
	function evaluateBigBoardPosition(boardIndex) {

	  if (bigBoardState[boardIndex] !== "") {
	    return 0;
	  }

	  return POSITION_WEIGHTS[boardIndex];

	}

	// その手が、勝敗に関係なく小盤面を引き分けで
	// 確定させるだけの手かどうかを判定する
	// (evaluateHardMoveは勝ち・防御・フォークの判定を
	//  すべて素通りした手にしか呼ばれないため、
	//  残り1マスを埋める = ただ引き分けにするだけの手)
	function isUselessDrawMove(boardCells) {

	  const emptyCount =
	    Array.from(boardCells).filter(
	      c => !c.dataset.player
	    ).length;

	  return emptyCount === 1;

	}

	// 相手が次に狙ってきそうな盤面ほど高いスコアを返す
	// (勝敗に直結しない場面で、先回りして妨害するための評価)
	function evaluateOpponentTargetValue(boardIndex, boardCells) {

	  if (bigBoardState[boardIndex] !== "") {
	    return 0;
	  }

	  const reach =
	    countReachForPlayer(boardCells, "〇");

	  const building =
	    countBuildingForPlayer(boardCells, "〇");

	  return (
	    reach * 6 +
	    building * 1.5 +
	    evaluateBigBoardPosition(boardIndex)
	  );

	}

	// Hard専用: 勝敗に直結しない場面での候補手の総合評価
	// (大盤面・小盤面の位置評価 + 相手の先回り妨害評価)
	function evaluateHardMove(cell, boards) {

	  const board = boards[cell.boardIndex];

	  const boardCells =
	    board.querySelectorAll(".cell");

	  let score = 0;

	  score += evaluateSmallBoardPosition(cell.cellIndex);

	  score += evaluateBigBoardPosition(cell.boardIndex) * 2;

	  score += evaluateOpponentTargetValue(
	    cell.boardIndex,
	    boardCells
	  );

	  if (isUselessDrawMove(boardCells)) {

	    score -= 50;

	  }

	  return score;

	}

	function aiMoveHard() {

	const boards =
	  document.querySelectorAll(".small-board");

	 const cells =
	document.querySelectorAll(".cell");

	  const emptyCells = [];

	  cells.forEach(cell => {

	    if (
	      cell.innerHTML === "" &&
	      !cell.closest(".won")
	    ) {

	      emptyCells.push(cell);

	    }

	  });

		// 空き無し
		if (emptyCells.length === 0) {
		  return;
		}

		// ======================
		// 大盤面で勝てる場所を探す
		// ======================

		const targetBoards = [];

		for (let pattern of winPatterns) {

		  const [a, b, c] = pattern;

		  const line = [
		    bigBoardState[a],
		    bigBoardState[b],
		    bigBoardState[c]
		  ];

		  const aiCount =
		    line.filter(v => v === "×").length;

		  const emptyIndex =
		    pattern.find(
		      index =>
		        bigBoardState[index] === ""
		    );

		  if (
		    aiCount === 2 &&
		    emptyIndex !== undefined
		  ) {

		    targetBoards.push(emptyIndex);

		  }

		}

		// ======================
		// 大盤面で勝てるなら優先
		// ======================

		if (targetBoards.length > 0) {

	  	const boardIndex =
	  	  targetBoards[0];

	  	const boardCells =
		    emptyCells.filter(
		      cell =>
		        cell.boardIndex === boardIndex
		    );

		  if (boardCells.length > 0) {

		    const center =
		      boardCells.find(
		        cell =>
		          cell.cellIndex === 4
		      );

		    if (center) {

		      aiPlace(center);

		    } else {

		      aiPlace(
		        boardCells[
		          Math.floor(
		       	    Math.random() *
		            boardCells.length
		          )
		        ]
		      );

		    }

		    return;

		  }

		}


		  // ======================
		  // 勝てるなら勝つ
		  // ======================

	 	for (let board of boards) {

	 	 if (
	 	   board.classList.contains("won") ||
	 	   board.classList.contains("draw-board")
	 	 ) {
	 	   continue;
	 	 }

	 	 const boardCells =
	 	   board.querySelectorAll(".cell");

	 	 for (let pattern of winPatterns) {

	 	   const [a,b,c] = pattern;

	 	   const line = [
	 	     boardCells[a],
	 	     boardCells[b],
	 	     boardCells[c]
	 	   ];

	 	   const aiCount =
	 	     line.filter(
	 	       cell =>
	 	         cell.dataset.player === "×"
	 	     ).length;

	 	   const emptyCell =
	 	     line.find(
	 	       cell =>
	 	         !cell.dataset.player
	 	     );

	 	   if (aiCount === 2 && emptyCell) {

	 	     aiPlace(emptyCell);

	 	     return;

	 	   }

	 	 }

		}

	 	 // ======================
	 	 // 負けそうなら防ぐ
	 	 // ======================

		  for (let board of boards) {

		  if (
		    board.classList.contains("won") ||
		    board.classList.contains("draw-board")
		  ) {
		    continue;
		  }

		  const boardCells =
		    board.querySelectorAll(".cell");

		  for (let pattern of winPatterns) {

		    const [a,b,c] = pattern;

		    const line = [
		      boardCells[a],
		      boardCells[b],
		      boardCells[c]
		    ];

		    const playerCount =
		      line.filter(
		        cell =>
		          cell.dataset.player === "〇"
		      ).length;

		    const emptyCell =
		      line.find(
		        cell =>
		          !cell.dataset.player
		      );

		    if (
		      playerCount === 2 &&
		      emptyCell
		    ) {

		      aiPlace(emptyCell);

		      return;

		    }

		  }

		}


		// ======================
		// 大盤面で負けそうなら防ぐ
		// ======================

		const blockBoards = [];

		for (let pattern of winPatterns) {

		  const [a, b, c] = pattern;

		  const line = [
		    bigBoardState[a],
		    bigBoardState[b],
		    bigBoardState[c]
		  ];

		  const playerCount =
		    line.filter(
		      v => v === "〇"
		    ).length;

		  const emptyIndex =
		    pattern.find(
		      index =>
		        bigBoardState[index] === ""
		    );

		  if (
		    playerCount === 2 &&
		    emptyIndex !== undefined
		  ) {

		    blockBoards.push(
		      emptyIndex
		    );

		  }

		}

		// 引き分け確定(残り1マス)の盤面は
		// 防いでも意味が無いので防御対象から除外する
		const validBlockBoards =
		  blockBoards.filter(index => {

		    const targetBoardCells =
		      boards[index].querySelectorAll(".cell");

		    return !isUselessDrawMove(targetBoardCells);

		  });

		if (validBlockBoards.length > 0) {

		  const boardIndex =
		    validBlockBoards[0];

		  const boardCells =
		    emptyCells.filter(
		      cell =>
		        cell.boardIndex === boardIndex
		    );

		  if (boardCells.length > 0) {

		const center =
		      boardCells.find(
		        cell =>
		          cell.cellIndex === 4
		      );

		    if (center) {

		      aiPlace(center);

		    } else {

		    aiPlace(
		      boardCells[
		        Math.floor(
		          Math.random() *
		          boardCells.length
		        )
		      ]
		    );

		   }

		    return;

		  }

		}

		// ======================
		// 本物のフォーク作成
		// ======================

		for (let board of boards) {

		  if (
		    board.classList.contains("won") ||
		    board.classList.contains("draw-board")
		  ) {
		    continue;
		  }

		  const boardCells =
		    Array.from(
		      board.querySelectorAll(".cell")
		    );

		  const emptyBoardCells =
		    boardCells.filter(
		      cell =>
		        !cell.dataset.player
		    );

		  for (let testCell of emptyBoardCells) {

		    testCell.dataset.player = "×";

		    const threats =
		      countThreats(boardCells);

		    delete testCell.dataset.player;

		    if (threats >= 2) {

		      aiPlace(testCell);

		      return;

		    }

		  }

		}

		// ======================
		// 相手のフォーク阻止
		// ======================

		for (let board of boards) {

		  if (
		    board.classList.contains("won") ||
		    board.classList.contains("draw-board")
		  ) {
		    continue;
		  }

		  const boardCells =
		    Array.from(
		      board.querySelectorAll(".cell")
		    );

		  const emptyBoardCells =
		    boardCells.filter(
		      cell =>
		        !cell.dataset.player
		    );

		  for (let testCell of emptyBoardCells) {

		    testCell.dataset.player = "〇";

		    let threats = 0;

		    for (let pattern of winPatterns) {

		      const [a,b,c] = pattern;

		      const line = [
		        boardCells[a],
		        boardCells[b],
		        boardCells[c]
		      ];

		      const playerCount =
		        line.filter(
		          cell =>
		            cell.dataset.player === "〇"
		        ).length;

		      const emptyCount =
		        line.filter(
		          cell =>
		            !cell.dataset.player
		        ).length;

		      if (
		        playerCount === 2 &&
		        emptyCount === 1
		      ) {

		        threats++;

		      }

		    }

		    delete testCell.dataset.player;

		    if (threats >= 2) {

		      aiPlace(testCell);

		      return;

		    }

		  }

		}

		// ======================
		// Hard専用: 位置評価 + 先回り妨害評価による最善手選択
		// (Normalの中央優先・角優先の固定ルールをここだけ置き換える)
		// ======================

		let bestScore = -Infinity;
		let bestCells = [];

		emptyCells.forEach(cell => {

		  const score = evaluateHardMove(cell, boards);

		  if (score > bestScore) {

		    bestScore = score;
		    bestCells = [cell];

		  } else if (score === bestScore) {

		    bestCells.push(cell);

		  }

		});

		aiPlace(
		  bestCells[
		    Math.floor(
		      Math.random() *
		      bestCells.length
		    )
		  ]
		);

	   }

	function aiMove() {

	  if (aiLevel === "easy") {

	    aiMoveEasy();
	    return;

	  }

	  if (aiLevel === "normal") {

	    aiMoveNormal();
	    return;

	  }

	  if (aiLevel === "hard") {

	    aiMoveHard();
	    return;

	  }

	}

	function aiMoveNormal() {

	const boards =
	  document.querySelectorAll(".small-board");

     const cells =
    document.querySelectorAll(".cell");

  const emptyCells = [];

  cells.forEach(cell => {

    if (
      cell.innerHTML === "" &&
      !cell.closest(".won")
    ) {

      emptyCells.push(cell);

    }

  });

 	// 空き無し
	if (emptyCells.length === 0) {
	  return;
	}

	// ======================
	// 大盤面で勝てる場所を探す
	// ======================

	const targetBoards = [];

	for (let pattern of winPatterns) {

	  const [a, b, c] = pattern;

	  const line = [
	    bigBoardState[a],
	    bigBoardState[b],
	    bigBoardState[c]
	  ];

	  const aiCount =
	    line.filter(v => v === "×").length;

	  const emptyIndex =
	    pattern.find(
	      index =>
	        bigBoardState[index] === ""
	    );

	  if (
	    aiCount === 2 &&
	    emptyIndex !== undefined
	  ) {

	    targetBoards.push(emptyIndex);

	  }

	}

	// ======================
	// 大盤面で勝てるなら優先
	// ======================

	if (targetBoards.length > 0) {

  	const boardIndex =
  	  targetBoards[0];

  	const boardCells =
	    emptyCells.filter(
	      cell =>
	        cell.boardIndex === boardIndex
	    );

	  if (boardCells.length > 0) {

	    const center =
	      boardCells.find(
	        cell =>
	          cell.cellIndex === 4
	      );

	    if (center) {

	      aiPlace(center);

	    } else {

	      aiPlace(
	        boardCells[
	          Math.floor(
	       	    Math.random() *
	            boardCells.length
	          )
	        ]
	      );

	    }

	    return;

	  }

	}


	  // ======================
	  // 勝てるなら勝つ
	  // ======================

 	for (let board of boards) {

 	 if (
 	   board.classList.contains("won") ||
 	   board.classList.contains("draw-board")
 	 ) {
 	   continue;
 	 }

 	 const boardCells =
 	   board.querySelectorAll(".cell");

 	 for (let pattern of winPatterns) {

 	   const [a,b,c] = pattern;

 	   const line = [
 	     boardCells[a],
 	     boardCells[b],
 	     boardCells[c]
 	   ];

 	   const aiCount =
 	     line.filter(
 	       cell =>
 	         cell.dataset.player === "×"
 	     ).length;

 	   const emptyCell =
 	     line.find(
 	       cell =>
 	         !cell.dataset.player
 	     );

 	   if (aiCount === 2 && emptyCell) {
console.log("勝利で置く");
 	     aiPlace(emptyCell);

 	     return;

 	   }

 	 }

	}

 	 // ======================
 	 // 負けそうなら防ぐ
 	 // ======================

	  for (let board of boards) {

	  if (
	    board.classList.contains("won") ||
	    board.classList.contains("draw-board")
	  ) {
	    continue;
	  }

	  const boardCells =
	    board.querySelectorAll(".cell");

	  for (let pattern of winPatterns) {

	    const [a,b,c] = pattern;

	    const line = [
	      boardCells[a],
	      boardCells[b],
	      boardCells[c]
	    ];

	    const playerCount =
	      line.filter(
	        cell =>
	          cell.dataset.player === "〇"
	      ).length;

	    const emptyCell =
	      line.find(
	        cell =>
	          !cell.dataset.player
	      );

	    if (
	      playerCount === 2 &&
	      emptyCell
	    ) {
console.log("小盤面防御で置く");
	      aiPlace(emptyCell);

	      return;

	    }

	  }

	}


	// ======================
	// 大盤面で負けそうなら防ぐ
	// ======================

	const blockBoards = [];

	for (let pattern of winPatterns) {

	  const [a, b, c] = pattern;

	  const line = [
	    bigBoardState[a],
	    bigBoardState[b],
	    bigBoardState[c]
	  ];

	  const playerCount =
	    line.filter(
	      v => v === "〇"
	    ).length;

	  const emptyIndex =
	    pattern.find(
	      index =>
	        bigBoardState[index] === ""
	    );

	  if (
	    playerCount === 2 &&
	    emptyIndex !== undefined
	  ) {

	    blockBoards.push(
	      emptyIndex
	    );

	  }

	}

	if (blockBoards.length > 0) {

	  const boardIndex =
	    blockBoards[0];

	  const boardCells =
	    emptyCells.filter(
	      cell =>
	        cell.boardIndex === boardIndex
	    );

	  if (boardCells.length > 0) {

	const center =
	      boardCells.find(
	        cell =>
	          cell.cellIndex === 4
	      );

	    if (center) {

	      aiPlace(center);

	    } else {
console.log("大盤面防御で置く");
	    aiPlace(
	      boardCells[
	        Math.floor(
	          Math.random() *
	          boardCells.length
	        )
	      ]
	    );

	   }

	    return;

	  }

	}

	// ======================
	// 本物のフォーク作成
	// ======================

	for (let board of boards) {

	  if (
	    board.classList.contains("won") ||
	    board.classList.contains("draw-board")
	  ) {
	    continue;
	  }

	  const boardCells =
	    Array.from(
	      board.querySelectorAll(".cell")
	    );

	  const emptyBoardCells =
	    boardCells.filter(
	      cell =>
	        !cell.dataset.player
	    );

	  for (let testCell of emptyBoardCells) {

	    testCell.dataset.player = "×";

	    const threats =
	      countThreats(boardCells);

	    delete testCell.dataset.player;

	    if (threats >= 2) {

console.log("フォーク作成で置く");

	      aiPlace(testCell);

	      return;

	    }

	  }

	}

	// ======================
	// 相手のフォーク阻止
	// ======================

	for (let board of boards) {

	  if (
	    board.classList.contains("won") ||
	    board.classList.contains("draw-board")
	  ) {
	    continue;
	  }

	  const boardCells =
	    Array.from(
	      board.querySelectorAll(".cell")
	    );

	  const emptyBoardCells =
	    boardCells.filter(
	      cell =>
	        !cell.dataset.player
	    );

	  for (let testCell of emptyBoardCells) {

	    testCell.dataset.player = "〇";

	    let threats = 0;

	    for (let pattern of winPatterns) {

	      const [a,b,c] = pattern;

	      const line = [
	        boardCells[a],
	        boardCells[b],
	        boardCells[c]
	      ];

	      const playerCount =
	        line.filter(
	          cell =>
	            cell.dataset.player === "〇"
	        ).length;

	      const emptyCount =
	        line.filter(
	          cell =>
	            !cell.dataset.player
	        ).length;

	      if (
	        playerCount === 2 &&
	        emptyCount === 1
	      ) {

	        threats++;

	      }

	    }

	    delete testCell.dataset.player;

	    if (threats >= 2) {
console.log("フォーク阻止で置く");
	      aiPlace(testCell);

	      return;

	    }

	  }

	}


	// ======================
	// 大盤面中央優先
	// ======================

	if (bigBoardState[4] === "") {

	  const centerBoardCells =
	    emptyCells.filter(
	      cell =>
	        cell.boardIndex === 4
	    );

	  if (centerBoardCells.length > 0) {

	    aiPlace(
	      centerBoardCells[
	        Math.floor(
	          Math.random() *
	          centerBoardCells.length
	        )
	      ]
	    );

	    return;

	  }

	}

	// ======================
	// 大盤面角優先
	// ======================

	const cornerBoards = [
	  0, 2, 6, 8
	];

	for (let boardIndex of cornerBoards) {

	  if (bigBoardState[boardIndex] !== "") {
	    continue;
	  }

	  const boardCells =
	    emptyCells.filter(
	      cell =>
	        cell.boardIndex === boardIndex
	    );

	const centerCell =
	  boardCells.find(
	    cell =>
	      cell.cellIndex === 4
	  );

	if (centerCell) {

	  aiPlace(centerCell);

	  return;

	}

	  if (boardCells.length > 0) {

	    aiPlace(
	      boardCells[
	        Math.floor(
	          Math.random() *
	          boardCells.length
	        )
	      ]
	    );

	    return;

	  }

	}

	// ======================
	// 中央優先
	// ======================

	const centerCells = [];

	emptyCells.forEach(cell => {

	  if (cell.cellIndex === 4) {

	    centerCells.push(cell);

	  }

	});

	if (centerCells.length > 0) {

	  aiPlace(
	    centerCells[
	      Math.floor(
	        Math.random() *
	        centerCells.length
	      )
	    ]
	  );

	  return;

	}

	// ======================
	// 角優先
	// ======================

	const cornerCells = [];

	emptyCells.forEach(cell => {

	  if (
	    cell.cellIndex === 0 ||
	    cell.cellIndex === 2 ||
	    cell.cellIndex === 6 ||
	    cell.cellIndex === 8
	  ) {

	    cornerCells.push(cell);

	  }

	});

	if (cornerCells.length > 0) {

	  aiPlace(
	    cornerCells[
	      Math.floor(
	        Math.random() *
	        cornerCells.length
	      )
	    ]
	  );

	  return;

	}

	// ======================
	// 最後だけランダム
	// ======================

	const randomCell =
	  emptyCells[
	    Math.floor(
	      Math.random() *
	      emptyCells.length
	    )
	  ];

	aiPlace(randomCell);
	   }

	backTitleBtn.addEventListener(
	  "click",
	  () => {

	    location.reload();

	  }
	);
