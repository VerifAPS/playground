(*
 * This program should just not crash
 * Added: 2014-10-12 by SB
 *)
PROGRAM cyclic
(* Moegliche Zustaende fuer den Automaten *)
VAR CONSTANT
	stateAfterBoot : BYTE := 0;
	stateInit : BYTE := 1;
	stateWaitForItem : BYTE := 2;
	stateWaitForCompressor1 : BYTE := 3;
	stateExtractItem1 : BYTE := 4;
	stateWaitForCompressor2 : BYTE := 5;
	stateExtractItem2 : BYTE := 6;
	stateRotateTable1 : BYTE := 7;
	statePunchItem : BYTE := 8;
	stateWaitForCompressor3 : BYTE := 9;
	stateRotateTable2 : BYTE := 10;
	stateWaitForCompressor4 : BYTE := 11;
	stateMoveToConveyer1 : BYTE := 12;
	stateWaitForCompressor5 : BYTE := 13;
	stateMoveToConveyer2 : BYTE := 14;
	stateRunConveyer : BYTE := 15;
	stateMoveToRobot : BYTE := 16;
	stateTurnToItem : BYTE := 17;
	stateTakeItem : BYTE := 18;
	stateTurnToMagazin : BYTE := 19;
END_VAR
(* Vordefinierte Konstanten fuer den gesamten Ablauf *)
VAR CONSTANT
	pickPosTurn : BYTE := 111;
	pickPosVert : BYTE := 80;
	pickPosArm : BYTE := 28;
	pickPosClaw : BYTE := 19;
	dropPosTurn : BYTE := 71;
	dropPosArm : BYTE := 37;
	moveThreshold : BYTE := 36;
	compressorDelay : DINT := 60000;
	extractionDelay : DINT := 15000;
	conveyerDelay : DINT := 42200;
END_VAR
(* Virtuelle Speicherstellen der Sensoren / Motoren *)
VAR
	(* 3D-Roboter *)
	turnDestPos AT %Q0.0.0 : BYTE;
	turnCurrPos AT %I0.0.1 : BYTE;
	vertDestPos AT %Q0.1.0 : BYTE;
	vertCurrPos AT %I0.1.1 : BYTE;
	armDestPos  AT %Q0.2.0 : BYTE;
	armCurrPos  AT %I0.2.1 : BYTE;
	clawDestPos AT %Q0.3.0 : BYTE;
	clawCurrPos AT %I0.3.1 : BYTE;
	(* Bearbeitungszentrum *)
	compressor AT %Q1.0.0 : BYTE;
	tableMotPow AT %Q1.1.0 : BYTE;
	tableMotDir AT %Q1.1.1 : BYTE;
	magazinLed AT %Q1.2.0 : BYTE;
	magazinPhoto AT %I1.3.0 : BYTE;
	magazinPusherOn AT %Q1.4.0 : BYTE;
	magazinPusherOff AT %Q1.5.0 : BYTE;
	conveyerMotPow AT %Q1.6.0 : BYTE;
	conveyerMotDir AT %Q1.6.1 : BYTE;
	conveyerLed AT %Q1.7.0 : BYTE;
	conveyerPhoto AT %I1.8.0 : BYTE;
	conveyerButton AT %I1.9.0 : BYTE;
	conveyerPusherOn AT %Q1.10.0 : BYTE;
	conveyerPusherOff AT %Q1.11.0 : BYTE;
	puncherButton AT %I1.12.0 : BYTE;
	puncher AT%Q1.13.0 : BYTE;
END_VAR
(* Verwendete Hilfsvariablen *)
VAR
	flagDelay : DINT := 0;
	flagState : BYTE := 0;
END_VAR
(* Verwendete Ein- und Ausgaenge *)
VAR_OUTPUT
	outState : BYTE;
	outError : BOOL := false;
END_VAR

	(* Motoren einmalig zur Nullposition fahren *)
	IF flagState = stateAfterBoot THEN
		
		compressor := 0;
		
		tableMotPow := 0;
		tableMotDir := 0;

		magazinLed := 0;
		magazinPusherOn := 0;
		magazinPusherOff := 0;
		
		conveyerMotPow := 0;
		conveyerMotDir := 0;
		conveyerLed := 0;
		conveyerPusherOn := 0;
		conveyerPusherOff := 0;
		
		turnDestPos := 0;
		vertDestPos := 0;
		armDestPos := 0;
		clawDestPos := 0;
		
		IF turnCurrPos = 0 AND armCurrPos = 0 AND clawCurrPos = 0 THEN
			flagState := stateInit;
		END_IF
	
	(* Anlage vor dem Start initialisieren *)
	ELSIF flagState = stateInit THEN
		
		flagDelay := 0;
		
		conveyerLed := 1;
		magazinLed := 1;
		
		turnDestPos := dropPosTurn;
		armDestPos := dropPosArm;
		
		IF turnCurrPos = dropPosTurn AND armCurrPos = dropPosArm AND vertCurrPos = 0 THEN
			IF clawCurrPos = 0 THEN
				flagState := stateWaitForItem;
			ELSE
				clawDestPos := 0;
			END_IF
		END_IF
	
	(* Warten, bis sich ein Werkstueck im Magazin befindet *)
	ELSIF flagState = stateWaitForItem THEN
	
		IF magazinPhoto = 1 THEN
			magazinLed := 0;
			flagState := stateWaitForCompressor1;
		END_IF
	
	(* Kompressor zum Ausfahren des Magazinschiebers vorbereiten *)
	ELSIF flagState = stateWaitForCompressor1 THEN
	
		compressor := 1;
		flagDelay := flagDelay + 1; {@NO_WARNING overflow-assign}
		
		IF flagDelay >= compressorDelay THEN
			compressor := 0;
			flagDelay := 0;
			flagState := stateExtractItem1;
		END_IF
	
	(* Werkstueck aus dem Magazin entnehmen - Teil 1 *)
	ELSIF flagState = stateExtractItem1 THEN

		magazinPusherOn := 1;
		flagDelay := flagDelay + 1; {@NO_WARNING overflow-assign}
		
		IF flagDelay >= extractionDelay THEN
			magazinPusherOn := 0;
			flagDelay := 0;
			flagState := stateWaitForCompressor2;
		END_IF
		
	(* Kompressor zum Einfahren des Magazinschiebers vorbereiten *)
	ELSIF flagState = stateWaitForCompressor2 THEN
	
		compressor := 1;
		flagDelay := flagDelay + 1; {@NO_WARNING overflow-assign}
		
		IF flagDelay >= compressorDelay THEN
			compressor := 0;
			flagDelay := 0;
			flagState := stateExtractItem2;
		END_IF
	
	(* Werkstueck aus dem Magazin entnehmen - Teil 2 *)
	ELSIF flagState = stateExtractItem2 THEN
	
		magazinPusherOff := 1;
		flagDelay := flagDelay + 1; {@NO_WARNING overflow-assign}
		
		IF flagDelay >= extractionDelay THEN
			magazinPusherOff := 0;
			flagDelay := 0;
			flagState := stateRotateTable1;
		END_IF
	
	(* Drehtisch aktivieren und Stanze-Schalter ueberwachen *)
	ELSIF flagState = stateRotateTable1 THEN
	
		tableMotPow := 200;
	
		IF puncherButton = 0 THEN
			tableMotPow := 0;
			flagState := stateWaitForCompressor3;
		END_IF
		
	(* Kompressor zum Stanzen vorbereiten *)
	ELSIF flagState = stateWaitForCompressor3 THEN
	
		compressor := 1;
		flagDelay := flagDelay + 1; {@NO_WARNING overflow-assign}
		
		IF flagDelay >= compressorDelay THEN
			compressor := 0;
			flagDelay := 0;
			flagState := statePunchItem;
		END_IF
	
	(* Werkstueck stanzen *)
	ELSIF flagState = statePunchItem THEN
		
		puncher := 1;
		flagDelay := flagDelay + 1; {@NO_WARNING overflow-assign}
		
		IF flagDelay >= extractionDelay THEN
			puncher := 0;
			flagDelay := 0;
			flagState := stateRotateTable2;
		END_IF
	
	(* Drehtisch aktivieren und Transportband-Schalter ueberwachen *)
	ELSIF flagState = stateRotateTable2 THEN
	
		tableMotPow := 200;
	
		IF conveyerButton = 0 THEN
			tableMotPow := 0;
			flagState := stateWaitForCompressor4;
		END_IF
	
	(* Kompressor zum Einfahren des Transportschiebers vorbereiten *)
	ELSIF flagState = stateWaitForCompressor4 THEN
	
		compressor := 1;
		flagDelay := flagDelay + 1; {@NO_WARNING overflow-assign}
		
		IF flagDelay >= compressorDelay THEN
			compressor := 0;
			flagDelay := 0;
			flagState := stateMoveToConveyer1;
		END_IF
	
	(* Werkstueck auf das Fliessband befoerdern - Teil 1 *)
	ELSIF flagState = stateMoveToConveyer1 THEN
	
		conveyerPusherOn := 1;
		flagDelay := flagDelay + 1; {@NO_WARNING overflow-assign}
		
		IF flagDelay >= extractionDelay THEN
			conveyerPusherOn := 0;
			flagDelay := 0;
			flagState := stateWaitForCompressor5;
		END_IF
	
	(* Kompressor zum Ausfahren des Transportschiebers vorbereiten *)
	ELSIF flagState = stateWaitForCompressor5 THEN
	
		compressor := 1;
		flagDelay := flagDelay + 1; {@NO_WARNING overflow-assign}
		
		IF flagDelay >= compressorDelay THEN
			compressor := 0;
			flagDelay := 0;
			flagState := stateMoveToConveyer2;
		END_IF
	
	(* Werkstueck auf das Fliessband befoerdern - Teil 2 *)
	ELSIF flagState = stateMoveToConveyer2 THEN
	
		conveyerPusherOff := 1;
		flagDelay := flagDelay + 1; {@NO_WARNING overflow-assign}
		
		IF flagDelay >= extractionDelay THEN
			conveyerPusherOff := 0;
			flagDelay := 0;
			flagState := stateRunConveyer;
		END_IF
	
	(* Fliessband aktivieren und auf das Werkstueck warten *)
	ELSIF flagState = stateRunConveyer THEN
		
		conveyerMotPow := 200;
		
		IF conveyerPhoto = 1 THEN
			conveyerLed := 0;
			flagDelay := 0;
			flagState := stateMoveToRobot;
		END_IF
	
	(* Drehen, Greifarm und Greifer ausstrecken *)
	ELSIF flagState = stateMoveToRobot THEN
	
		flagDelay := flagDelay + 1; {@NO_WARNING overflow-assign}
		
		IF flagDelay > conveyerDelay THEN
			conveyerMotPow := 0;
			flagDelay := 0;
			flagState := stateTurnToItem;
		END_IF
	
	(* Drehen, Greifarm und Greifer ausstrecken *)
	ELSIF flagState = stateTurnToItem THEN

		turnDestPos := pickPosTurn;
		vertDestPos := pickPosVert;
		armDestPos := pickPosArm;
		
		IF turnCurrPos = pickPosTurn AND vertCurrPos = pickPosVert AND armCurrPos = pickPosArm THEN
			flagState := stateTakeItem;
		END_IF
		
	(* Werkstueck vom Fliessband greifen *)
	ELSIF flagState = stateTakeItem THEN
	
		clawDestPos := pickPosClaw;
		
		IF clawCurrPos = pickPosClaw THEN
			flagState := stateTurnToMagazin;
		END_IF
	
	(* Das Werkstueck zum Magazin drehen *)
	ELSIF flagState = stateTurnToMagazin THEN
	
		vertDestPos := 0;
		
		IF vertCurrPos < moveThreshold THEN
			flagState := stateInit;
		END_IF
	
	(* Fehlerzustand - alles ausschalten *)
	ELSE
	
		outError := true;
		
		compressor := 0;
		puncher := 0;
		
		tableMotPow := 0;
		tableMotDir := 2;
		
		conveyerMotPow := 0;
		conveyerMotDir := 2;
	
	(* Ende des Zustandsautomaten *)
	END_IF

	(* Ausgabe vorbereiten *)
	outState := flagState;
	
END_PROGRAM 