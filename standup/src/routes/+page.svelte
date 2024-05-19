<script lang="ts">
	import { Button } from "$lib/components/ui/Button";
	import * as Table from "$lib/components/ui/table";
	import { onDestroy } from "svelte";

	// const and variables
	let participants = [
		{
			name: "Arsham",
			checked: false,
			showTime: false,
			timeRemaining: 120,
			elapsed: 0,
		},
	];
	let newName = "";
	let showModal = false;
	let timers = [];

	// shuffle
	function shuffleArray() {
		let n = participants.length;
		while (n) {
			let i = Math.floor(Math.random() * n--);
			[participants[n], participants[i]] = [participants[i], participants[n]];
		}
		participants.forEach((p) => {
			p.checked = false;
			p.showTime = false;
			p.timeRemaining = 120;
			p.elapsed = 0;
		});
		participants = participants.slice();
		clearTimers();
	}

	function addParticipant() {
		if (newName.trim() !== "") {
			participants.push({ name: newName, checked: false, showTime: false, timeRemaining: 120, elapsed: 0 });
			participants = [...participants];
			newName = "";
			showModal = false; // Close the modal after adding the name
		}
	}

	function toggleCheck(index: number) {
		participants[index].checked = !participants[index].checked;
		participants[index].showTime = participants[index].checked;

		if (participants[index].checked) {
			startTimer(index);
		} else {
			stopTimer(index);
			participants[index].timeRemaining = 120;
			participants[index].elapsed = 0;
		}

		participants = [...participants]; // Reassign to trigger reactivity
	}

	function startTimer(index: number) {
		participants[index].timeRemaining = 120;
		participants[index].elapsed = 0;
		timers[index] = setInterval(() => {
			if (participants[index].timeRemaining > 0) {
				participants[index].timeRemaining -= 1;
				participants[index].elapsed = 120 - participants[index].timeRemaining;
				participants = [...participants];
			} else {
				clearInterval(timers[index]);
				participants[index].showTime = false;
				participants = [...participants];
			}
		}, 1000);
	}

	function stopTimer(index: number) {
		clearInterval(timers[index]);
		participants[index].showTime = false;
		participants = [...participants];
	}

	function clearTimers() {
		timers.forEach((timer) => clearInterval(timer));
	}

	function removeParticipant(index: number) {
		participants.splice(index, 1);
		participants = [...participants]; // Reassign to trigger reactivity
		clearInterval(timers[index]);
		timers.splice(index, 1);
	}

	onDestroy(() => {
		clearTimers();
	});
</script>

<main class="mt-12">
	<div class="w-full flex flex-row items-center">
		<h1 class="title text-4xl">Standup Turns</h1>
		<div class="m-6 flex flex-row gap-6 object-center">
			<Button class="rounded-xl" on:click={() => (showModal = true)}>
				<span class="material-icons">add</span>
			</Button>
			<Button class="rounded-xl ml-4" on:click={shuffleArray}>Shuffle</Button>
		</div>
	</div>
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Names</Table.Head>
				<Table.Head></Table.Head>
				<Table.Head></Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each participants as participant, index}
				<Table.Row>
					<Table.Cell class={participant.checked ? "line-through font-medium" : "font-medium"} on:click={() => toggleCheck(index)}>
						{participant.name}
					</Table.Cell>
					<Table.Cell>
						<!-- participant.showTime -->
						{#if true}
							<div>
								<span>{Math.floor(participant.timeRemaining / 60)}:{participant.timeRemaining % 60 < 10 ? "0" : ""}{participant.timeRemaining % 60} remaining</span>
								<progress value={participant.elapsed} max="120" class="w-full h-4 bg-gray-200 rounded-lg overflow-hidden">
									<div class="bg-blue-600 h-" style="width: {(participant.elapsed / 120) * 100}%"></div>
								</progress>
							</div>
						{/if}
					</Table.Cell>
					<Table.Cell>
						<Button class="cursor-pointer text-red-400 hover:shadow-lg hover:bg-gray-100 shadow-sm bg-gray-100" on:click={() => removeParticipant(index)}>delete</Button>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	{#if showModal}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
			<div class="bg-white rounded-xl p-4 object-center align-middle w-80 h-80">
				<div class="flex flex-col items-center justify-center h-full">
					<input type="text" bind:value={newName} class="rounded-xl p-2 border-2 border-gray-300 w-full mb-4" placeholder="Enter new name" on:keyup={(event) => event.key === "Enter" && addParticipant()} />

					<div class="flex flex-row gap-5">
						<Button class="rounded-xl mt-4" on:click={addParticipant}>Add Name</Button>
						<Button class="rounded-xl mt-4 text-red-500" on:click={() => (showModal = false)}>Cancel</Button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</main>
