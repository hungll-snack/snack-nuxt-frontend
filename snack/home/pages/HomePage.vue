<!-- 📌 views/HomePage.vue -->
<script setup lang="ts">
import TypingEffect from "@/home/pages/TypingEffect.vue";
import SearchLLM from "@/home/pages/SearchLLM.vue";

</script>

<template>
    <v-container fluid class="pa-4">
        <v-row justify="center">
            <TypingEffect />
        </v-row>
        <v-row justify="center" class="mt-4">
            <SearchLLM />
        </v-row>
        <v-row>
            <v-col cols="12" class="text-center">
                <v-divider></v-divider>
                <p>&copy; 2025 SNACK. All rights reserved.</p>
            </v-col>
        </v-row>
    </v-container>
</template>
