<script lang="ts">
    import { onMount } from "svelte";

    const {
        handleLeft,
        handleRight,
    }: {
        handleLeft: () => void;
        handleRight: () => void;
    } = $props();

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "ArrowLeft") {
            handleLeft();
        } else if (event.key === "ArrowRight") {
            handleRight();
        }
    }

    onMount(() => {
        window.addEventListener("keydown", handleKeydown);
        return () => {
            window.removeEventListener("keydown", handleKeydown);
        };
    });
</script>
