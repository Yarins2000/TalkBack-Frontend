import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameRequestService } from 'src/app/services/game-request/game-request.service';
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
    private gameHubService: GameHubService) { }

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

  listeningOnHubMethods() {
    this.gameHubService.onStartGame(() => {
      console.log("starting a game in " + this.gameGroupName + " group name");
    });

    this.gameHubService.onMoveMade((moveResult: boolean, fromRow: number, fromColumn: number, toRow: number, toColumn: number) => {
      if (moveResult) {
        if (this.board[fromRow][fromColumn] === CheckerState.White)
          this.selectedPiece = this.getPiece(this.senderPieces, fromRow, fromColumn);
        else
          this.selectedPiece = this.getPiece(this.recipientPieces, fromRow, fromColumn);

        this.makeMove(fromRow, fromColumn, toRow, toColumn);
        if(this.isGameOver())
          alert("you won!");
      }
    });

    this.gameHubService.onInvalidMove(() => {
      alert("invalid move");
    })
  }

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

  preventFromMovingOpponentPieces(row: number, column: number) {
    return (this.isPlayerPlayWhite && this.board[row][column] === CheckerState.White) ||
      (!this.isPlayerPlayWhite && this.board[row][column] === CheckerState.Black);
  }

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

  isSquareEnabled(row: number, column: number) {
    return (row + column) % 2 === 1;
  }

  onSquareClick(toRow: number, toColumn: number) {
    if (this.selectedPiece) {
      if (this.board[toRow][toColumn] === CheckerState.Empty)
        this.gameHubService.makeMove(this.gameGroupName, this.selectedPiece.position[0], this.selectedPiece.position[1], toRow, toColumn);
    }
  }

  onPieceClick(row: number, column: number) {
    if (this.board[row][column] === CheckerState.White)
      this.selectedPiece = this.getPiece(this.senderPieces, row, column);
    else
      this.selectedPiece = this.getPiece(this.recipientPieces, row, column);
  }

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
      this.switchTurn();
    }
  }

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

  getPiece(pieces: Piece[], row: number, column: number) {
    return pieces.find(p => p.position[0] === row && p.position[1] == column)!;
  }

  getMoveDifference(fromRow: number, toRow: number) {
    return Math.abs(fromRow - toRow);
  }

  switchTurn() {
    // this.isCurrentPlayer = !this.isCurrentPlayer;
    if (this.isTurn === true)
      this.isTurn = false;
    else
      this.isTurn = true;
  }

  isGameOver() {
    return this.senderPieces.length === 0 || this.recipientPieces.length === 0;
  }

  ngOnDestroy(): void {
    this.gameRequestService.setGameRequest(false);
    this.gameRequestService.setRequestAccepted(false);
    this.gameHubService.leaveGroup(this.gameGroupName);
  }
}
