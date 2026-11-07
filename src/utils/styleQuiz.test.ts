import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STYLE_QUIZ_QUESTIONS, evaluateQuizAnswers } from './styleQuiz';
import { SUIT_CATALOG } from '../data/suitCatalog';

test('STYLE_QUIZ_QUESTIONS contains exactly 5 detailed sartorial questions', () => {
  assert.equal(STYLE_QUIZ_QUESTIONS.length, 5);
  STYLE_QUIZ_QUESTIONS.forEach((q, index) => {
    assert.equal(q.number, index + 1);
    assert.ok(q.title.length > 10, 'Question has descriptive title');
    assert.ok(q.subtitle.length > 10, 'Question has subtitle');
    assert.ok(q.options.length >= 4, 'Question has at least 4 bespoke options');
    q.options.forEach((opt) => {
      assert.ok(opt.id, 'Option has ID');
      assert.ok(opt.label, 'Option has label');
      assert.ok(opt.sublabel, 'Option has sublabel');
      assert.ok(Object.keys(opt.suitScores).length > 0, 'Option assigns suit scores');
    });
  });
});

test('recommends Sovereign Black-Tie for evening formal black-tie preferences', () => {
  const answers = {
    'q1-occasion': 'black-tie-gala',
    'q2-silhouette': 'savile-row-structured',
    'q3-style-icon': 'james-bond',
    'q4-fabric-texture': 'tasmanian-super160',
    'q5-color-palette': 'obsidian-midnight',
  };

  const result = evaluateQuizAnswers(answers, SUIT_CATALOG);
  assert.equal(result.recommendedSuit.id, 'sovereign-black-tie');
  assert.ok(result.matchScore >= 88 && result.matchScore <= 99);
  assert.equal(result.archetypeTitle, 'The Sovereign Savile Row Connoisseur');
  assert.ok(result.cutterRationale.includes('Sovereign Tuxedo'));
  assert.equal(result.recommendedFabricId, 'loro-piana-super160');
  assert.ok(result.stylingTips.length >= 3);
});

test('recommends Aurelia Bridal Silk Tuxedo for bridal couture preferences', () => {
  const answers = {
    'q1-occasion': 'bridal-wedding',
    'q2-silhouette': 'modern-sculptural-fluid',
    'q3-style-icon': 'bianca-jagger',
    'q4-fabric-texture': 'mulberry-silk-duchesse',
    'q5-color-palette': 'aurelia-ivory',
  };

  const result = evaluateQuizAnswers(answers, SUIT_CATALOG);
  assert.equal(result.recommendedSuit.id, 'aurelia-bridal-couture');
  assert.equal(result.archetypeTitle, 'The Haute Bridal & Modern Couture Visionary');
  assert.ok(result.cutterRationale.includes('Aurelia'));
  assert.equal(result.recommendedFabricId, 'dormeuil-silk-bridal');
});

test('recommends Milanese Executive Pinstripe for boardroom sprezzatura preferences', () => {
  const answers = {
    'q1-occasion': 'executive-boardroom',
    'q2-silhouette': 'milanese-soft',
    'q3-style-icon': 'giorgio-armani',
    'q4-fabric-texture': 'silk-weft-pinstripe',
    'q5-color-palette': 'titanium-navy',
  };

  const result = evaluateQuizAnswers(answers, SUIT_CATALOG);
  assert.equal(result.recommendedSuit.id, 'milanese-executive-pin');
  assert.equal(result.archetypeTitle, 'The Milanese Executive & Transatlantic Powerhouse');
  assert.equal(result.recommendedFabricId, 'zegna-trofeo-pinstripe');
});

test('recommends Imperial Emerald Velvet for red carpet celebration preferences', () => {
  const answers = {
    'q1-occasion': 'celebration-red-carpet',
    'q2-silhouette': 'milanese-soft',
    'q3-style-icon': 'giorgio-armani',
    'q4-fabric-texture': 'cotton-silk-velvet',
    'q5-color-palette': 'emerald-jewel',
  };

  const result = evaluateQuizAnswers(answers, SUIT_CATALOG);
  assert.equal(result.recommendedSuit.id, 'imperial-emerald-smoking');
  assert.equal(result.archetypeTitle, 'The Imperial Red Carpet & Velvet Luminary');
  assert.equal(result.recommendedFabricId, 'vbc-emerald-velvet');
});

test('recommends Athena Double-Breasted Power Suit for executive women leadership', () => {
  const answers = {
    'q1-occasion': 'executive-boardroom',
    'q2-silhouette': 'double-breasted-power',
    'q3-style-icon': 'bianca-jagger',
    'q4-fabric-texture': 'silk-weft-pinstripe',
    'q5-color-palette': 'titanium-navy',
  };

  const result = evaluateQuizAnswers(answers, SUIT_CATALOG);
  assert.equal(result.recommendedSuit.id, 'athena-boardroom-women');
  assert.equal(result.archetypeTitle, 'The Sovereign Leadership & Double-Breasted Authority');
});

test('handles empty or partial answers gracefully with valid fallbacks', () => {
  const result = evaluateQuizAnswers({}, SUIT_CATALOG);
  assert.ok(result.recommendedSuit);
  assert.ok(result.archetypeTitle);
  assert.ok(result.matchScore >= 88);
  assert.ok(result.stylingTips.length > 0);
});
