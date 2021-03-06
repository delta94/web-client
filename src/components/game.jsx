import React from 'react';
import { Mutation, Query } from 'react-apollo';
import Loading from './loading';

import { ADD_STONE } from '../graphql/mutations';
import { AuthContextConsumer } from '../contexts/authContext';

import Board from './board';
import Display from './display';

export default class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stones: [],
    };
  }

  handleAddStone(addStoneFn) {
    const playStone = (x, y) => {
      addStoneFn({ variables: { gameId: this.props.id, x, y } });
    };
    return playStone;
  }

  renderBoard(game) {
    return (
      <AuthContextConsumer>
        {({ token }) => {
          return (
            <Mutation mutation={ADD_STONE} context={{ token }}>
              {(addStone, { loading, error, data }) => {
                return (
                  <Board
                    game={game}
                    addStone={this.handleAddStone(addStone)}
                    error={error}
                  />
                );
              }}
            </Mutation>
          );
        }}
      </AuthContextConsumer>
    );
  }

  renderDisplay(game) {
    return (
      <Display
        playerTurnId={game.playerTurnId}
        gameId={game.id}
        gameIsOver={game.status === 'complete'}
        pass={this.handlePass}
        newGame={this.handleNewGame}
        game={game}
      />
    );
  }

  renderGame(game) {
    return (
      <section className="game columns">
        <div className="column">{this.renderBoard(game)}</div>
        <div className="column">{this.renderDisplay(game)}</div>
      </section>
    );
  }

  render() {
    const { id } = this.props;
    return (
      <Query
        query={null} // TODO(eac): Fixme
        variables={{ id }}
        pollInterval={500}
        partialRefetch={true}
      >
        {({ loading, error, data }) => {
          if (loading) return <Loading />;
          if (error) return <p>No game loaded</p>;

          return this.renderGame(data.game);
        }}
      </Query>
    );
  }
}
