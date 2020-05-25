// Import stylesheets
import "./css/foundation.min.css";
import "./css/app.css";

import Vue from "vue";

var vm = new Vue({
  el: "#app",
  data: {
    playerHealth: 100,
    playerMaxHealth: 100,
    playerStamina: 100,
    playerMaxStamina: 100,
    playerExp: 0,
    playerExpPerLevel: 100,
    monsterHealth: 100,
    monsterMaxHealth: 100,
    monsterStamina: 100,
    monsterMaxStamina: 100,
    monsterExp: 0,
    monsterExpPerLevel: 120,
    gameIsRunning: false,
    turns: []
  },
  methods: {
    startGame: function() {
      this.gameIsRunning = true;
      this.playerHealth = 100;
      this.playerMaxHealth = 100;
      this.playerStamina = 100;
      this.playerMaxStamina = 100;
      this.playerExp = 0;
      this.monsterHealth = 100;
      this.monsterMaxHealth = 100;
      this.monsterStamina = 100;
      this.monsterMaxStamina = 100;
      this.monsterExp = 0;
      this.turns = [];
    },
    attack: function() {
      var damage = this.calculateDamage(3, 10);
      this.monsterHealth -= damage;
      this.playerStamina -= Math.floor(damage / 2);
      this.turns.unshift({
        isPlayer: true,
        text: "Player hits Monster for " + damage
      });
      if (this.checkWin()) return;

      this.playerExp += damage;

      this.monsterChoose();
    },
    specialAttack: function() {
      var damage = this.calculateDamage(10, 20);
      this.monsterHealth -= damage;
      this.playerStamina -= Math.floor(damage / 2);
      this.turns.unshift({
        isPlayer: true,
        text: "Player hits Monster hard for " + damage
      });
      if (this.checkWin()) return;

      this.playerExp += damage;

      this.monsterChoose();
    },
    heal: function() {
      if (this.playerHealth <= (this.playerMaxHealth - 10)) {
        this.playerHealth += 10;
      } else {
        this.playerHealth = this.playerMaxHealth;
      }
      this.turns.unshift({
        isPlayer: true,
        text: "Player heals for 10"
      });

      this.monsterChoose();
    },
    giveUp: function() {
      this.gameIsRunning = false;
    },
    monsterChoose: function() {
      if(this.monsterHealthPercent <= 40 && Math.random() > 0.4) {
        this.monsterHeal();
        return;
      }
      if (this.monsterStaminaPercent > 30 && Math.random() > 0.3) {
        this.monsterSpecialAttack();
        return;
      }
      this.monsterAttack();
    },
    monsterAttack: function() {
      var damage = this.calculateDamage(5, 12);
      this.playerHealth -= damage;
      this.monsterStamina -= Math.floor(damage / 2);
      this.turns.unshift({
        isPlayer: false,
        text: "Monster hits Player for " + damage
      });
      this.checkWin();

      this.monsterExp += damage;
    },
    monsterSpecialAttack: function() {
      var damage = this.calculateDamage(15, 25);
      this.playerHealth -= damage;
      this.monsterStamina -= Math.floor(damage / 2);
      this.turns.unshift({
        isPlayer: false,
        text: "Monster hits Player hard for " + damage
      });
      if (this.checkWin()) return;

      this.monsterExp += damage;
    },
    monsterHeal: function() {
      if (this.monsterHealth <= (this.monsterMaxHealth - 10)) {
        this.monsterHealth += 10;
      } else {
        this.monsterHealth = this.monsterMaxHealth;
      }
      this.turns.unshift({
        isPlayer: false,
        text: "Monster heals for 10"
      });
    },
    calculateDamage: function(min, max) {
      return Math.max(Math.floor(Math.random() * max) + 1, min);
    },
    checkWin: function() {
      if (this.monsterHealth <= 0) {
        if (confirm("You won! New game?")) {
          this.startGame();
        } else {
          this.gameIsRunning = false;
        }
        return true;
      } else if (this.playerHealth <= 0) {
        if (confirm("You lost! New game?")) {
          this.startGame();
        } else {
          this.gameIsRunning = false;
        }
        return true;
      }
      return false;
    }
  },
  computed: {
    playerLevel: function() {
      return Math.floor(this.playerExp / this.playerExpPerLevel);
    },
    monsterLevel: function() {
      return Math.floor(this.monsterExp / this.monsterExpPerLevel);
    },
    playerExpPercent: function() {
      var currentLevelExp =
        this.playerExp - this.playerLevel * this.playerExpPerLevel;
      return Math.floor((currentLevelExp * 100) / this.playerExpPerLevel);
    },
    monsterExpPercent: function() {
      var currentLevelExp =
        this.monsterExp - this.monsterLevel * this.monsterExpPerLevel;
      return Math.floor((currentLevelExp * 100) / this.monsterExpPerLevel);
    },
    playerHealthPercent: function() {
      return Math.floor((this.playerHealth * 100) / this.playerMaxHealth);
    },
    monsterHealthPercent: function() {
      return Math.floor((this.monsterHealth * 100) / this.monsterMaxHealth);
    },
    playerStaminaPercent: function() {
      return Math.floor((this.playerStamina * 100) / this.playerMaxStamina);
    },
    monsterStaminaPercent: function() {
      return Math.floor((this.monsterStamina * 100) / this.monsterMaxStamina);
    }
  },
  watch: {
    playerLevel: function(oldLevel, newLevel) {
      this.playerMaxHealth += 10 * (newLevel - oldLevel);
      this.playerMaxStamina += 10 * (newLevel - oldLevel);
    },
    monsterLevel: function(oldLevel, newLevel) {
      this.monsterMaxHealth += 10 * (newLevel - oldLevel);
      this.monsterMaxStamina += 10 * (newLevel - oldLevel);
    }
  }
});

setInterval(function() {
  if(vm.playerStamina <= (vm.playerMaxStamina - 1)) vm.playerStamina += 1;
  else vm.playerStamina = vm.playerMaxStamina;

  if(vm.monsterStamina <= (vm.monsterMaxStamina - 1)) vm.monsterStamina += 1;
  else vm.monsterStamina = vm.monsterMaxStamina;
}, 500);