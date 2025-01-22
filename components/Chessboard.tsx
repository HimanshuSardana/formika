"use client";

import React, { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

interface ChessGameProps {
        pgn: any;
        currentMoveIndex: number;
}

const ChessGame: React.FC<ChessGameProps> = ({ pgn, currentMoveIndex }) => {
        const [game, setGame] = useState(new Chess());

        useEffect(() => {
                const updateGamePosition = () => {
                        if (pgn) {
                                const newGame = new Chess();
                                const moves = pgn.moves;

                                newGame.reset();
                                moves.slice(0, currentMoveIndex + 1).forEach((move: any) => {
                                        newGame.move(move.notation.notation);
                                });

                                setGame(newGame);
                        }
                };

                updateGamePosition();
        }, [pgn, currentMoveIndex]);

        return (
                <div className="flex flex-col items-center p-5">
                        <Chessboard
                                position={game.fen()}
                                boardWidth={800}
                                arePiecesDraggable={false}
                                customDarkSquareStyle={{ backgroundColor: "rgba(50,50,66)" }}
                                animationDuration={70}
                                customLightSquareStyle={{ backgroundColor: "#EEEED2" }}
                        />
                        <div className="mt-4">
                                {game.isGameOver() && (
                                        <p className="text-red-600">
                                                Game Over! {game.isCheckmate() ? "Checkmate!" : "Draw!"}
                                        </p>
                                )}
                                {game.isCheck() && <p className="text-yellow-500">Check!</p>}
                        </div>
                </div>
        );
};

export default ChessGame;

