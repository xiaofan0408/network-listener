<script setup>
import {ref, toRaw } from 'vue';
import CsvExportor from "csv-exportor";
import JsonViewer from 'vue-json-viewer';

const hadStart = ref(false);
const listData = ref([]);
const pagination = {
  onChange: page => {
    console.log(page);
  },
  pageSize: 10,
};

function addToList(request){
    console.log(request)
    if (!request.request.url.endsWith("/api/v1/search") || "POST" != request.request.method) {
        return;
    }

    listData.value.unshift({
        key: request.startedDateTime,
        title: request.request.url,
        method: request.request.method,
        content: request.response.body,
        postData: request.request.postData
    })
}

function listenNetwork(request) {
    request.getContent(function(content, encoding){
        request.response.body = {};
        request.response.body.content = content;
        request.response.body.encoding = encoding;
        addToList(request);
    });
}

function start() {
    console.log("start");
    chrome.devtools.network.onRequestFinished.addListener(listenNetwork);
    hadStart.value = true;
}

function stop() {
    console.log("stop");
    chrome.devtools.network.onRequestFinished.removeListener(listenNetwork);
    hadStart.value = false;
} 

function clear(){
    console.log("clear");
    listData.value = []
}

function exportCsv(item){
    const itemRow = toRaw(item);
    let content = JSON.parse(itemRow.content.content);
    let header = [];
    content.title.forEach(element => {
        header.push(element.key)
    });
    CsvExportor.downloadCsv(content.data, { header }, "test.csv");
}

</script>

<template>
     <a-layout>
    <a-page-header
        class="demo-page-header"
        style="border: 1px solid rgb(235, 237, 240)"
        >
        <template #extra>
            <a-button key="3" type="primary" @click="start()" :disabled="hadStart">Start</a-button>
            <a-button key="2" @click="stop()" :disabled="!hadStart">Stop</a-button>
            <a-button key="1" @click="clear()">Clear</a-button>
        </template>
    </a-page-header>
      <a-layout-content>
        <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="listData">
            <template #renderItem="{ item }">
            <a-list-item key="item.key">
                <a-list-item-meta  :description="item.key">
                <template #title>
                    <p>{{ item.title }}</p>
                </template>
                </a-list-item-meta>
                <p>{{JSON.parse(item.postData.text).sql}}</p>
                <a-button @click="exportCsv(item)">Export</a-button>
            </a-list-item>
            </template>
        </a-list>
      </a-layout-content>
    </a-layout>

</template>

<style scoped>
.json_box{
  width: 1000px;
  margin: auto;
  margin-top: 35px;
}
</style>