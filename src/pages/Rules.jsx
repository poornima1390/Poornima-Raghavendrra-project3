import React from 'react';
import '../styles/Rules.css';

const Rules = () => {
  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">How to Play Sudoku</h1>
        <p className="page-subtitle">Master the rules and become a Sudoku champion</p>
      </header>

      <section className="rules-section">

        <div className="rules-overview">
          <div className="overview-card">
            <i className="fas fa-th-large"></i>
            <h3>9x9 Grid</h3>
            <p>Standard game uses a 9x9 grid</p>
          </div>
          <div className="overview-card">
            <i className="fas fa-border-all"></i>
            <h3>3x3 Regions</h3>
            <p>Divided into 9 smaller 3x3 boxes</p>
          </div>
          <div className="overview-card">
            <i className="fas fa-hashtag"></i>
            <h3>Numbers 1-9</h3>
            <p>Each number appears once per row, column, and box</p>
          </div>
          <div className="overview-card">
            <i className="fas fa-lightbulb"></i>
            <h3>Logic Only</h3>
            <p>No math required — pure logic puzzle</p>
          </div>
        </div>

        <div className="rules-container">

          <div className="rule-item">
            <div className="rule-number">1</div>
            <div className="rule-content">
              <h2>The Objective</h2>
              <p>The goal of Sudoku is to fill a 9×9 grid with digits so that each column, each row, and each of the nine 3×3 subgrids contain all of the digits from 1 to 9.</p>
              <div className="rule-example">
                <div className="example-grid">
                  <div className="example-row">
                    <span className="example-cell">5</span>
                    <span className="example-cell">3</span>
                    <span className="example-cell">4</span>
                    <span className="example-cell">6</span>
                    <span className="example-cell">7</span>
                    <span className="example-cell">8</span>
                    <span className="example-cell">9</span>
                    <span className="example-cell">1</span>
                    <span className="example-cell">2</span>
                  </div>
                </div>
                <p className="example-caption">Each row must contain 1–9 exactly once</p>
              </div>
            </div>
          </div>

          <div className="rule-item">
            <div className="rule-number">2</div>
            <div className="rule-content">
              <h2>The Rules</h2>
              <ul className="rule-list">
                <li><i className="fas fa-check-circle"></i> <strong>Each row</strong> must contain the numbers 1–9 exactly once</li>
                <li><i className="fas fa-check-circle"></i> <strong>Each column</strong> must contain the numbers 1–9 exactly once</li>
                <li><i className="fas fa-check-circle"></i> <strong>Each 3x3 box</strong> must contain the numbers 1–9 exactly once</li>
                <li><i className="fas fa-times-circle"></i> <strong>No repeats</strong> allowed in any row, column, or box</li>
                <li><i className="fas fa-puzzle-piece"></i> The puzzle starts with some cells pre-filled (these are called "givens")</li>
              </ul>
            </div>
          </div>

          <div className="rule-item">
            <div className="rule-number">3</div>
            <div className="rule-content">
              <h2>Game Variations</h2>
              <table className="variation-table">
                <thead>
                  <tr>
                    <th>Grid Size</th>
                    <th>Numbers</th>
                    <th>Subgrid</th>
                    <th>Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>6x6</td>
                    <td>1–6</td>
                    <td>2x3</td>
                    <td>Easy</td>
                  </tr>
                  <tr>
                    <td>9x9</td>
                    <td>1–9</td>
                    <td>3x3</td>
                    <td>Normal</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rule-item">
            <div className="rule-number">4</div>
            <div className="rule-content">
              <h2>Basic Strategies</h2>
              <ol className="strategy-list">
                <li><strong>Scanning:</strong> Look for rows and columns that are almost complete to deduce missing numbers</li>
                <li><strong>Cross-hatching:</strong> Focus on a single number and see where it can and cannot go in each box</li>
                <li><strong>Counting:</strong> In a row, column, or box, count which numbers are missing</li>
                <li><strong>Pencil Marks:</strong> Note possible candidates in empty cells (not needed in our easy version!)</li>
              </ol>
            </div>
          </div>

        </div>
      </section>

      {/* Credits — links to your email, GitHub, LinkedIn */}
      <div id="credits" className="credits-section">
        <h2 className="credits-title">Credits</h2>
        <div className="credits-grid">
          <div className="credit-card">
            <div className="credit-avatar">
              <i className="fas fa-user-circle"></i>
            </div>
            <h3>Poornima Raghavendrra</h3>
            <p className="credit-role">Lead Developer</p>
            <div className="credit-links">
              <a href="mailto:poornimar139@gmail.com" className="credit-link">
                <i className="fas fa-envelope"></i>
                poornimar139@gmail.com
              </a>
              <a href="https://github.com/poornima1390" className="credit-link" target="_blank" rel="noreferrer">
                <i className="fab fa-github"></i>
                @poornima1390
              </a>
              <a href="https://www.linkedin.com/in/poornima-raghavendrra/" className="credit-link" target="_blank" rel="noreferrer">
                <i className="fab fa-linkedin"></i>
                poornima-raghavendrra
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Rules;