<template>
    <v-container fluid class="pa-4">
        <!-- 배경 이미지와 텍스트를 포함한 Hero 섹션 -->
        <v-row>
            <v-col cols="12">
                <v-img
                        src='@/assets/images/Logo.jpg'
                        height="400"
                        class="rounded-xl"
                >
                    <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-col class="text-center">
                        </v-col>
                    </v-row>
                </v-img>
            </v-col>
        </v-row>

        <!-- Footer 섹션 -->
        <v-row>
            <v-col cols="12" class="text-center">
                <v-divider></v-divider>
                <p>&copy; 2025 SNACK. All rights reserved.</p>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "HomePage"
}
</script>

<style scoped>

</style>