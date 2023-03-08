import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameRequestService } from 'src/app/checkers/services/game-request/game-request.service';
import { ToastService } from 'src/app/toast/toast.service';
import { CheckerState } from '../models/CheckerState.model';
import { Piece } from '../models/piece.model';
import { GameHubService } from '../services/gameHub/game-hub.service';

@Component({
  selector: 'app-checkers',
  templateUrl: './checkers.component.html',
  styleUrls: ['./checkers.component.css']
})
export class CheckersComponent implements OnInit, OnDestroy {
  private selectedPiece: Piece | null = null;
  isPieceClicked: boolean = false;
  board: CheckerState[][] = [];
  senderId: string = '';
  recipientId: string = '';
  gameGroupName: string = '';
  isTurn = false;
  isPlayerPlayWhite = false; // determines whether the user play as the sender(white pieces) or not

  senderPieces: Piece[] = [];
  recipientPieces: Piece[] = [];

  constructor(private gameRequestService: GameRequestService, private router: Router, private route: ActivatedRoute,
    private gameHubService: GameHubService, private toastService: ToastService) { }

  ngOnInit() {
    this.initializeBoard();
    this.listeningOnHubMethods();

    this.route.queryParams.subscribe(params => {
      this.senderId = params['senderId'];
      this.recipientId = params['recipientId'];
      this.isTurn = params['isCurrentPlayer'] === "true" ? true : false;
      this.isPlayerPlayWhite = this.isTurn;
      console.log("sender: " + this.senderId);
      console.log("recipient: " + this.recipientId);
      this.gameGroupName = this.senderId + '_' + this.recipientId;
    });

    this.gameHubService.joinGroup(this.gameGroupName);
    this.gameHubService.startGame(this.gameGroupName);

    this.gameRequestService.requestAccepted$.subscribe(value => {
      console.log("requestAccepted: " + value);
      if (value) {
        this.gameRequestService.closeModals();
      }
      else
        this.router.navigate(['/chat']);
    });
  }

  /**
   * Initializes the board and the pieces arrays.
   */
  initializeBoard() {
    for (let i = 0; i < 8; i++) {
      this.board[i] = [];
      for (let j = 0; j < 8; j++) {
        if (i < 3) {
          if (i % 2 == 0) {
            if (j % 2 != 0) {
              this.board[i][j] = CheckerState.Black;
              this.recipientPieces.push(new Piece(CheckerState.Black, [i, j], false, true));
            }
            else
              this.board[i][j] = CheckerState.Empty;
          }
          else
            if (j % 2 == 0) {
              this.board[i][j] = CheckerState.Black;
              this.recipientPieces.push(new Piece(CheckerState.Black, [i, j], false, true));
            }
            else
              this.board[i][j] = CheckerState.Empty;
        }
        else if (i > 4) {
          if (i % 2 == 0) {
            if (j % 2 != 0) {
              this.board[i][j] = CheckerState.White;
              this.senderPieces.push(new Piece(CheckerState.White, [i, j], false, true));
            }
            else
              this.board[i][j] = CheckerState.Empty;
          }
          else
            if (j % 2 == 0) {
              this.board[i][j] = CheckerState.White;
              this.senderPieces.push(new Piece(CheckerState.White, [i, j], false, true));
            }
            else
              this.board[i][j] = CheckerState.Empty;
        }
        else {
          this.board[i][j] = CheckerState.Empty;
        }
      }
    }
  }

  /**
   * Listens to signalr 'on' methods.
   */
  listeningOnHubMethods() {
    this.gameHubService.onStartGame(() => {
      console.log("starting a game in " + this.gameGroupName + " group name");
    });

    this.gameHubService.onMoveMade((moveResult: boolean, fromRow: number, fromColumn: number, toRow: number, toColumn: number, canSwitchTurns: boolean) => {
      if (moveResult) {
        if (this.board[fromRow][fromColumn] === CheckerState.White)
          this.selectedPiece = this.getPiece(this.senderPieces, fromRow, fromColumn);
        else
          this.selectedPiece = this.getPiece(this.recipientPieces, fromRow, fromColumn);

        this.makeMove(fromRow, fromColumn, toRow, toColumn);

        if(canSwitchTurns)
          this.switchTurn();

        if(this.isGameOver())
          alert("you won!");
      }
    });

    this.gameHubService.onInvalidMove(() => {
      this.toastService.show("Inavlid move", { classname: 'bg-danger text-light', delay: 1500 });
    });
  }

  /**
   * Checks for a piece (given its row and column) wether it becomes a king or not.
   * @param row the piece's row position.
   * @param column the piece's column position.
   * @returns a string represents the piece's class - if it should be a king or not.
   */
  isKing(row: number, column: number): string {
    let piece: Piece;
    if (this.board[row][column] === CheckerState.White)
      piece = this.getPiece(this.senderPieces, row, column);
    else
      piece = this.getPiece(this.recipientPieces, row, column);

    if (piece.isKing) {
      if (piece.color === CheckerState.White)
        return "king whitePiece";
      else
        return "king";
    }
    return "";
  }

  /**
   * Checks if the current player is allowed to move the white / black pieces and prevent from him to move the opponent's pieces .
   * @param row the current piece row
   * @param column the current piece column
   * @returns true if the player is allowed to move the pieces, otherwise false.
   */
  preventFromMovingOpponentPieces(row: number, column: number) {
    return (this.isPlayerPlayWhite && this.board[row][column] === CheckerState.White) ||
      (!this.isPlayerPlayWhite && this.board[row][column] === CheckerState.Black);
  }

  /**
   * Checks wether the current piece should be shown or not.
   * @param row the piece row
   * @param column the piece column
   * @returns true if the piece should be shown, false otherwise.
   */
  shouldShowPiece(row: number, column: number): boolean {
    const currentColor = this.board[row][column];
    if (currentColor === CheckerState.Empty) {
      return false;
    }
    let currentPiece: Piece = {} as Piece;
    if (currentColor === CheckerState.Black)
      currentPiece = this.getPiece(this.recipientPieces, row, column);
    else
      currentPiece = this.getPiece(this.senderPieces, row, column);

    if (currentPiece)
      return currentPiece.isAlive;
    else
      return false;
  }

  /**
   * Checks if the square at position [toRo, toColumn] is empty and can be moved to. If so, invokes the makeMove hub's method.
   * @param toRow the square's row to check
   * @param toColumn the square's column to check
   */
  onSquareClick(toRow: number, toColumn: number) {
    if (this.selectedPiece) {
      if (this.board[toRow][toColumn] === CheckerState.Empty)
        this.gameHubService.makeMove(this.gameGroupName, this.selectedPiece.position[0], this.selectedPiece.position[1], toRow, toColumn);
    }
  }

  /**
   * Gets the piece of the received row and column
   * @param row the received row
   * @param column the received column
   */
  onPieceClick(row: number, column: number) {
    if (this.board[row][column] === CheckerState.White)
      this.selectedPiece = this.getPiece(this.senderPieces, row, column);
    else
      this.selectedPiece = this.getPiece(this.recipientPieces, row, column);
  }

  /**
   * Makes a move (a single step or a capture), updates the board and pieces respectively and switches the turns.
   * @param fromRow the piece's starting row
   * @param fromColumn the piece's starting column
   * @param toRow the piece's ending row
   * @param toColumn the piece's ending column
   */
  makeMove(fromRow: number, fromColumn: number, toRow: number, toColumn: number) {
    if (this.selectedPiece) {
      let currentPieceColor = this.selectedPiece.color;
      this.moveSelectedPiece(fromRow, fromColumn, toRow, toColumn);
      if (this.getMoveDifference(fromRow, toRow) === 2) {
        let capturedPiece: Piece = {} as Piece;
        const middleRow = (fromRow + toRow) / 2;
        const middleColumn = (fromColumn + toColumn) / 2;
        if (currentPieceColor === CheckerState.White) {
          capturedPiece = this.getPiece(this.recipientPieces, middleRow, middleColumn);
          capturedPiece.isAlive = false;
          this.recipientPieces = this.recipientPieces.filter(p => !(p.position[0] === capturedPiece.position[0] &&
            p.position[1] === capturedPiece.position[1]));
        }
        else {
          capturedPiece = this.getPiece(this.senderPieces, middleRow, middleColumn);
          capturedPiece.isAlive = false;
          this.senderPieces = this.senderPieces.filter(p => !(p.position[0] === capturedPiece.position[0] &&
            p.position[1] === capturedPiece.position[1]));
        }
        this.board[middleRow][middleColumn] = CheckerState.Empty;
      }
      //this.switchTurn();
    }
  }

  /**
   * Moves the selected piece and checks if it becomes a king.
   * @param fromRow the piece's startting row
   * @param fromColumn the piece's starting column
   * @param toRow the piece's ending row
   * @param toColumn the piece's ending column
   */
  moveSelectedPiece(fromRow: number, fromColumn: number, toRow: number, toColumn: number) {
    this.board[toRow][toColumn] = this.board[fromRow][fromColumn];
    this.board[fromRow][fromColumn] = CheckerState.Empty;
    this.selectedPiece!.position = [toRow, toColumn];
    if (this.selectedPiece!.color === CheckerState.White) {
      if (toRow === 0)
        this.selectedPiece!.isKing = true;
    }
    else
      if (toRow === 7)
        this.selectedPiece!.isKing = true;
    this.selectedPiece = null;
  }

  /**
   * Gets a specific piece from the received piece array.
   * @param pieces the received piece array
   * @param row the piece's row
   * @param column the piece's column
   * @returns the obtained piece from the array
   */
  getPiece(pieces: Piece[], row: number, column: number) {
    return pieces.find(p => p.position[0] === row && p.position[1] == column)!;
  }

  /**
   * Gets the move length
   * @param fromRow starting row 
   * @param toRow ending row
   * @returns the length of the step
   */
  getMoveDifference(fromRow: number, toRow: number) {
    return Math.abs(fromRow - toRow);
  }

  /**
   * Switches the turns.
   */
  switchTurn() {
    this.isTurn = !this.isTurn;
  }

  /**
   * Checks if the game is over by checking the piece's arrays length.
   * @returns true if the game is over, false otherwise.
   */
  isGameOver() {
    return this.senderPieces.length === 0 || this.recipientPieces.length === 0;
  }

  ngOnDestroy(): void {
    this.gameRequestService.setGameRequest(false);
    this.gameRequestService.setRequestAccepted(false);
    this.gameHubService.leaveGroup(this.gameGroupName);
    this.toastService.clear();
  }
}
