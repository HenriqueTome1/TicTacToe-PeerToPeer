<template>
  <table>
    <tr>
      <td
        :style="`color: ${positions[0].color};`"
        class="editText noselect"
        @click="changeSimbol(positions[0])"
      >{{positions[0].text}}</td>

      <td
        class="vert editText noselect"
        :style="`color: ${positions[1].color}`"
        @click="changeSimbol(positions[1])"
      >{{positions[1].text}}</td>

      <td
        :style="`color: ${positions[2].color}`"
        class="editText noselect"
        @click="changeSimbol(positions[2])"
      >{{positions[2].text}}</td>
    </tr>
    <tr>
      <td
        class="hori editText noselect"
        :style="`color: ${positions[3].color}`"
        @click="changeSimbol(positions[3])"
      >{{positions[3].text}}</td>
      <td
        class="vert hori editText noselect"
        :style="`color: ${positions[4].color}`"
        @click="changeSimbol(positions[4])"
      >{{positions[4].text}}</td>
      <td
        class="hori editText noselect"
        :style="`color: ${positions[5].color}`"
        @click="changeSimbol(positions[5])"
      >{{positions[5].text}}</td>
    </tr>
    <tr>
      <td
        :style="`color: ${positions[6].color}`"
        class="editText noselect"
        @click="changeSimbol(positions[6])"
      >{{positions[6].text}}</td>
      <td
        class="vert editText noselect"
        :style="`color: ${positions[7].color}`"
        @click="changeSimbol(positions[7])"
      >{{positions[7].text}}</td>
      <td
        :style="`color: ${positions[8].color}`"
        class="editText noselect"
        @click="changeSimbol(positions[8])"
      >{{positions[8].text}}</td>
    </tr>
  </table>
</template>

<script>
/* eslint-disable */
export default {
  props:{
      positions: {
          type: Array,
          required: true
      }
  },
  methods: {
    changeSimbol(position) {
      this.$emit("changeSimbol", position);
    }
  }
};
</script>

<style>
.editText {
  font-size: 7vw;
  font-family: Arial;
  text-align: center;
  cursor: pointer;
  padding: 0px;
}

td {
  width: 150px;
  height: 150px;
}
table {
  margin: 5px auto;
}

.vert {
  border-left: 2px solid black;
  border-right: 2px solid black;
}
.hori {
  border-top: 2px solid black;
  border-bottom: 2px solid black;
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Opera and Firefox */
}
</style>