<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { Plus, Shuffle, Trash2, Play, Pause, RotateCcw, Check, Sun, Moon } from "lucide-svelte";
	import { Button } from "$lib/components/ui/button";
	import { Progress } from "$lib/components/ui/progress";
	import * as Card from "$lib/components/ui/card";

	type Participant = {
		id: number;
		name: string;
		done: boolean;
		secondsLeft: number;
	};

	const STORAGE_KEY = "standup-turns/v2";
	const MIN_MINUTES = 0.5;
	const MAX_MINUTES = 30;

	let nextId = 1;
	let participants: Participant[] = [];
	let durationSeconds = 120; // per-person time budget
	let minutesInput = 2;

	let activeId: number | null = null;
	let interval: ReturnType<typeof setInterval> | null = null;

	let newName = "";
	let dark = false;

	// ----- persistence ------------------------------------------------------
	function load() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const saved = JSON.parse(raw) as {
					participants: Participant[];
					durationSeconds: number;
					dark: boolean;
				};
				if (Array.isArray(saved.participants) && saved.participants.length) {
					participants = saved.participants.map((p) => ({ ...p }));
					nextId = Math.max(...participants.map((p) => p.id)) + 1;
				}
				if (saved.durationSeconds) durationSeconds = saved.durationSeconds;
				dark = !!saved.dark;
			}
		} catch {
			/* ignore corrupt storage */
		}

		if (!participants.length) {
			participants = [makeParticipant("Arsham")];
		}
		minutesInput = durationSeconds / 60;
		applyTheme();
	}

	function save() {
		try {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({ participants, durationSeconds, dark })
			);
		} catch {
			/* storage may be unavailable */
		}
	}

	// ----- helpers ----------------------------------------------------------
	function makeParticipant(name: string): Participant {
		return { id: nextId++, name, done: false, secondsLeft: durationSeconds };
	}

	function formatTime(seconds: number): string {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s < 10 ? "0" : ""}${s}`;
	}

	const done = () => participants.filter((p) => p.done).length;

	// ----- timer ------------------------------------------------------------
	function stopInterval() {
		if (interval) {
			clearInterval(interval);
			interval = null;
		}
	}

	function tick() {
		const p = participants.find((x) => x.id === activeId);
		if (!p) return stopSpeaker();
		if (p.secondsLeft > 0) {
			p.secondsLeft -= 1;
			participants = participants;
			if (p.secondsLeft === 0) {
				p.done = true;
				stopSpeaker();
			}
		}
	}

	/** Make `id` the active speaker and start their countdown. */
	function startSpeaker(id: number) {
		stopInterval();
		activeId = id;
		const p = participants.find((x) => x.id === id);
		if (p && (p.done || p.secondsLeft <= 0)) {
			p.done = false;
			p.secondsLeft = durationSeconds;
		}
		participants = participants;
		interval = setInterval(tick, 1000);
	}

	/** Pause whoever is speaking, keeping their remaining time. */
	function stopSpeaker() {
		stopInterval();
		activeId = null;
		participants = participants;
	}

	function onNameClick(id: number) {
		if (activeId === id) stopSpeaker();
		else startSpeaker(id);
	}

	function markDone(id: number) {
		const p = participants.find((x) => x.id === id);
		if (!p) return;
		if (activeId === id) stopSpeaker();
		p.done = !p.done;
		if (!p.done) p.secondsLeft = durationSeconds;
		participants = participants;
	}

	function resetPerson(id: number) {
		const p = participants.find((x) => x.id === id);
		if (!p) return;
		if (activeId === id) stopSpeaker();
		p.done = false;
		p.secondsLeft = durationSeconds;
		participants = participants;
	}

	// ----- list actions -----------------------------------------------------
	function addParticipant() {
		const name = newName.trim();
		if (!name) return;
		participants = [...participants, makeParticipant(name)];
		newName = "";
	}

	function removeParticipant(id: number) {
		if (activeId === id) stopSpeaker();
		participants = participants.filter((p) => p.id !== id);
	}

	function shuffle() {
		stopSpeaker();
		const a = [...participants];
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		participants = a.map((p) => ({ ...p, done: false, secondsLeft: durationSeconds }));
	}

	function resetAll() {
		stopSpeaker();
		participants = participants.map((p) => ({
			...p,
			done: false,
			secondsLeft: durationSeconds
		}));
	}

	function applyDuration() {
		const minutes = Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, Number(minutesInput) || 2));
		minutesInput = minutes;
		durationSeconds = Math.round(minutes * 60);
		// refresh anyone who hasn't been touched yet
		participants = participants.map((p) =>
			p.done || (activeId === p.id) ? p : { ...p, secondsLeft: durationSeconds }
		);
	}

	// ----- theme ------------------------------------------------------------
	function applyTheme() {
		document.documentElement.classList.toggle("dark", dark);
	}
	function toggleTheme() {
		dark = !dark;
		applyTheme();
	}

	// ----- lifecycle --------------------------------------------------------
	onMount(load);
	onDestroy(stopInterval);

	// persist whenever meaningful state changes
	$: if (typeof document !== "undefined") save(), participants, durationSeconds, dark;
</script>

<svelte:head>
	<title>Standup Turns</title>
</svelte:head>

<main class="min-h-screen bg-background text-foreground px-4 py-10">
	<div class="mx-auto w-full max-w-2xl">
		<Card.Root>
			<Card.Header class="flex flex-row items-start justify-between gap-4">
				<div>
					<Card.Title class="text-3xl font-bold tracking-tight">Standup Turns</Card.Title>
					<Card.Description>
						Shuffle the order and give everyone their fair share of time.
					</Card.Description>
				</div>
				<Button variant="ghost" size="icon" aria-label="Toggle theme" on:click={toggleTheme}>
					{#if dark}<Sun class="h-5 w-5" />{:else}<Moon class="h-5 w-5" />{/if}
				</Button>
			</Card.Header>

			<Card.Content class="space-y-6">
				<!-- controls -->
				<div class="flex flex-wrap items-center gap-3">
					<Button on:click={shuffle} class="gap-2">
						<Shuffle class="h-4 w-4" /> Shuffle
					</Button>
					<Button variant="outline" on:click={resetAll} class="gap-2">
						<RotateCcw class="h-4 w-4" /> Reset all
					</Button>
					<div class="ml-auto flex items-center gap-2 text-sm">
						<label for="minutes" class="text-muted-foreground">Minutes each</label>
						<input
							id="minutes"
							type="number"
							min={MIN_MINUTES}
							max={MAX_MINUTES}
							step="0.5"
							bind:value={minutesInput}
							on:change={applyDuration}
							class="h-9 w-20 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						/>
					</div>
				</div>

				<!-- list -->
				<ul class="divide-y divide-border rounded-lg border border-border">
					{#each participants as p, i (p.id)}
						{@const active = activeId === p.id}
						<li
							class="flex items-center gap-3 p-3 transition-colors {active
								? 'bg-accent'
								: ''}"
						>
							<span class="w-6 shrink-0 text-center text-sm text-muted-foreground">
								{i + 1}
							</span>

							<button
								type="button"
								class="min-w-0 flex-1 text-left"
								on:click={() => onNameClick(p.id)}
							>
								<div class="flex items-center gap-2">
									<span
										class="truncate text-lg font-medium {p.done
											? 'text-muted-foreground line-through'
											: ''}"
									>
										{p.name}
									</span>
									{#if active}
										<Pause class="h-4 w-4 text-primary" />
									{:else if !p.done}
										<Play class="h-4 w-4 text-muted-foreground/60" />
									{/if}
								</div>

								{#if active || p.secondsLeft < durationSeconds || p.done}
									<div class="mt-1.5 flex items-center gap-2">
										<Progress
											value={durationSeconds - p.secondsLeft}
											max={durationSeconds}
											class="h-2 flex-1 {p.secondsLeft === 0 ? '[&>div]:bg-destructive' : ''}"
										/>
										<span
											class="w-12 shrink-0 text-right font-mono text-sm tabular-nums {p.secondsLeft <=
												10 && p.secondsLeft > 0
												? 'text-destructive'
												: 'text-muted-foreground'}"
										>
											{formatTime(p.secondsLeft)}
										</span>
									</div>
								{/if}
							</button>

							<Button
								variant="ghost"
								size="icon"
								aria-label="Mark done"
								class={p.done ? "text-green-600" : "text-muted-foreground"}
								on:click={() => markDone(p.id)}
							>
								<Check class="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Reset timer"
								class="text-muted-foreground"
								on:click={() => resetPerson(p.id)}
							>
								<RotateCcw class="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Remove {p.name}"
								class="text-destructive"
								on:click={() => removeParticipant(p.id)}
							>
								<Trash2 class="h-4 w-4" />
							</Button>
						</li>
					{/each}

					{#if participants.length === 0}
						<li class="p-6 text-center text-sm text-muted-foreground">
							No one here yet — add your first name below.
						</li>
					{/if}
				</ul>

				<!-- add -->
				<form class="flex items-center gap-2" on:submit|preventDefault={addParticipant}>
					<input
						type="text"
						bind:value={newName}
						placeholder="Add a name…"
						class="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					/>
					<Button type="submit" class="gap-2">
						<Plus class="h-4 w-4" /> Add
					</Button>
				</form>
			</Card.Content>

			<Card.Footer class="justify-between text-sm text-muted-foreground">
				<span>{participants.length} {participants.length === 1 ? "person" : "people"}</span>
				<span>{done()} done</span>
			</Card.Footer>
		</Card.Root>
	</div>
</main>
