# pip install opencv-python mediapipe numpy

import cv2
import mediapipe as mp
import numpy as np
import math
import os
import time

def is_hand_open(hand_landmarks):
    open_fingers = 0
    tips = [8, 12, 16, 20]
    pips = [6, 10, 14, 18]
    wrist = hand_landmarks.landmark[0]
    
    for tip, pip in zip(tips, pips):
        tip_dist = math.hypot(hand_landmarks.landmark[tip].x - wrist.x, hand_landmarks.landmark[tip].y - wrist.y)
        pip_dist = math.hypot(hand_landmarks.landmark[pip].x - wrist.x, hand_landmarks.landmark[pip].y - wrist.y)
        if tip_dist > pip_dist:
            open_fingers += 1
            
    return open_fingers >= 3

def main():
    vid = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    vid.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    vid.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    mp_hands = mp.solutions.hands
    mp_drawing = mp.solutions.drawing_utils

    hands = mp_hands.Hands(
        max_num_hands=2,
        model_complexity=1, 
        min_detection_confidence=0.5, 
        min_tracking_confidence=0.5
    )

    arr = []
    cur = []
    draw = False
    sx = None
    sy = None
    writing_active = False  # controlled by left hand

    landmark_style = mp_drawing.DrawingSpec(color=(255, 255, 255), thickness=1, circle_radius=2)
    connection_style = mp_drawing.DrawingSpec(color=(29, 62, 73), thickness=2)
    active_style = mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=1, circle_radius=2)
    active_conn = mp_drawing.DrawingSpec(color=(0, 200, 0), thickness=2)
    inactive_style = mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=1, circle_radius=2)
    inactive_conn = mp_drawing.DrawingSpec(color=(0, 0, 200), thickness=2)

    os.makedirs("images", exist_ok=True)
    
    # SAVE box (top-left)
    save_in_box = False
    save_x1, save_y1, save_x2, save_y2 = 20, 20, 250, 120
    save_message_time = 0  # timestamp when save was triggered
    
    # RESET box (top-right, will be calculated after getting frame size)
    reset_in_box = False

    while vid.isOpened():
        success, img = vid.read()
        if not success:
            break

        img = cv2.flip(img, 1)
        h, w, c = img.shape

        # RESET box position (top-right)
        reset_x1 = w - 250
        reset_y1 = 20
        reset_x2 = w - 20
        reset_y2 = 120

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        res = hands.process(img_rgb)

        # Background effect
        overlay = img.copy()
        cv2.rectangle(overlay, (0, 0), (w, h), (2, 6, 10), -1)
        img = cv2.addWeighted(overlay, 0.85, img, 0.15, 0)

        # Draw SAVE button
        cv2.rectangle(img, (save_x1, save_y1), (save_x2, save_y2), (0, 255, 0), 2)
        cv2.putText(img, "SAVE", (60, 85), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 255, 0), 3, cv2.LINE_AA)

        # Draw RESET button
        cv2.rectangle(img, (reset_x1, reset_y1), (reset_x2, reset_y2), (0, 165, 255), 2)
        cv2.putText(img, "RESET", (reset_x1 + 30, reset_y2 - 30), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 165, 255), 3, cv2.LINE_AA)

        # Draw existing strokes
        for path in arr:
            if len(path) >= 2:
                pts = np.array([[p['x'], p['y']] for p in path], np.int32).reshape((-1, 1, 2))
                cv2.polylines(img, [pts], False, (29, 62, 73), 15, cv2.LINE_AA)
                cv2.polylines(img, [pts], False, (97, 208, 245), 6, cv2.LINE_AA)

        # Identify left and right hands
        left_hand = None
        right_hand = None

        if res.multi_hand_landmarks and res.multi_handedness:
            for lm, handedness in zip(res.multi_hand_landmarks, res.multi_handedness):
                label = handedness.classification[0].label
                # MediaPipe labels are mirrored (flipped image), so "Left" in mediapipe = right on screen
                if label == "Left":  # This is actually left hand on screen (because flipped)
                    left_hand = lm
                elif label == "Right":  # This is actually right hand on screen
                    right_hand = lm

        # Process LEFT hand (control hand - open/closed detection)
        if left_hand is not None:
            hand_open = is_hand_open(left_hand)
            writing_active = not hand_open  # closed = active

            # Display status
            if hand_open:
                status = "TERBUKA - Tidak Aktif"
                color = (0, 0, 255)
            else:
                status = "TERTUTUP - Aktif Menulis"
                color = (0, 255, 0)
            
            cv2.putText(img, status, (200, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2, cv2.LINE_AA)

            # Draw left hand landmarks
            if hand_open:
                mp_drawing.draw_landmarks(img, left_hand, mp_hands.HAND_CONNECTIONS, inactive_style, inactive_conn)
            else:
                mp_drawing.draw_landmarks(img, left_hand, mp_hands.HAND_CONNECTIONS, active_style, active_conn)

            # Check if left hand fingertips are in SAVE box
            fingertip_ids_left = [4, 8, 12, 16, 20]
            fingers_in_save_left = 0
            for fid in fingertip_ids_left:
                cx, cy = int(left_hand.landmark[fid].x * w), int(left_hand.landmark[fid].y * h)
                if save_x1 <= cx <= save_x2 and save_y1 <= cy <= save_y2:
                    fingers_in_save_left += 1

            if fingers_in_save_left >= 3 and not save_in_box and len(arr) > 0:
                black_bg = np.zeros((h, w, 3), dtype=np.uint8)
                for path in arr:
                    if len(path) >= 2:
                        pts = np.array([[p['x'], p['y']] for p in path], np.int32).reshape((-1, 1, 2))
                        cv2.polylines(black_bg, [pts], False, (29, 62, 73), 15, cv2.LINE_AA)
                        cv2.polylines(black_bg, [pts], False, (97, 208, 245), 6, cv2.LINE_AA)
                filename = os.path.join("images", f"drawing_{int(time.time()*1000)}.png")
                cv2.imwrite(filename, black_bg)
                save_in_box = True
                save_message_time = time.time()
                arr = []
                cur = []
                draw = False
                cv2.rectangle(img, (save_x1, save_y1), (save_x2, save_y2), (0, 255, 255), cv2.FILLED)
            elif fingers_in_save_left < 3:
                save_in_box = False

            # Check if left hand fingertips are in RESET box
            fingers_in_reset_left = 0
            for fid in fingertip_ids_left:
                cx, cy = int(left_hand.landmark[fid].x * w), int(left_hand.landmark[fid].y * h)
                if reset_x1 <= cx <= reset_x2 and reset_y1 <= cy <= reset_y2:
                    fingers_in_reset_left += 1

            if fingers_in_reset_left >= 3 and not reset_in_box:
                arr = []
                cur = []
                draw = False
                reset_in_box = True
                cv2.rectangle(img, (reset_x1, reset_y1), (reset_x2, reset_y2), (0, 255, 255), cv2.FILLED)
            elif fingers_in_reset_left < 3:
                reset_in_box = False

        else:
            writing_active = False
            cv2.putText(img, "Tangan kiri tidak terdeteksi", (200, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (100, 100, 100), 2, cv2.LINE_AA)

        # Process RIGHT hand (drawing hand)
        if right_hand is not None:
            mp_drawing.draw_landmarks(img, right_hand, mp_hands.HAND_CONNECTIONS, landmark_style, connection_style)

            ind = right_hand.landmark[8]
            rx = ind.x * w
            ry = ind.y * h

            if sx is None:
                sx = rx
                sy = ry
            else:
                sx += (rx - sx) * 0.45
                sy += (ry - sy) * 0.45

            # Check if at least 3 fingertips are in SAVE box
            fingertip_ids = [4, 8, 12, 16, 20]
            fingers_in_save = 0
            for fid in fingertip_ids:
                cx, cy = int(right_hand.landmark[fid].x * w), int(right_hand.landmark[fid].y * h)
                if save_x1 <= cx <= save_x2 and save_y1 <= cy <= save_y2:
                    fingers_in_save += 1

            if fingers_in_save >= 3 and not save_in_box and len(arr) > 0:
                black_bg = np.zeros((h, w, 3), dtype=np.uint8)
                for path in arr:
                    if len(path) >= 2:
                        pts = np.array([[p['x'], p['y']] for p in path], np.int32).reshape((-1, 1, 2))
                        cv2.polylines(black_bg, [pts], False, (29, 62, 73), 15, cv2.LINE_AA)
                        cv2.polylines(black_bg, [pts], False, (97, 208, 245), 6, cv2.LINE_AA)
                filename = os.path.join("images", f"drawing_{int(time.time()*1000)}.png")
                cv2.imwrite(filename, black_bg)
                save_in_box = True
                save_message_time = time.time()
                arr = []
                cur = []
                draw = False
                cv2.rectangle(img, (save_x1, save_y1), (save_x2, save_y2), (0, 255, 255), cv2.FILLED)
            elif fingers_in_save < 3:
                save_in_box = False

            # Check if at least 3 fingertips are in RESET box
            fingers_in_reset = 0
            for fid in fingertip_ids:
                cx, cy = int(right_hand.landmark[fid].x * w), int(right_hand.landmark[fid].y * h)
                if reset_x1 <= cx <= reset_x2 and reset_y1 <= cy <= reset_y2:
                    fingers_in_reset += 1

            if fingers_in_reset >= 3 and not reset_in_box:
                arr = []
                cur = []
                draw = False
                reset_in_box = True
                cv2.rectangle(img, (reset_x1, reset_y1), (reset_x2, reset_y2), (0, 255, 255), cv2.FILLED)
            elif fingers_in_reset < 3:
                reset_in_box = False

            # Drawing cursor
            cursor_layer = img.copy()
            if writing_active:
                cv2.circle(cursor_layer, (int(sx), int(sy)), 6, (255, 255, 255), -1)
                img = cv2.addWeighted(cursor_layer, 1.0, img, 0.0, 0)

                if not draw:
                    draw = True
                    cur = []
                    arr.append(cur)
                cur.append({'x': sx, 'y': sy})
            else:
                cv2.circle(cursor_layer, (int(sx), int(sy)), 6, (97, 208, 245), -1)
                img = cv2.addWeighted(cursor_layer, 0.4, img, 0.6, 0)
                draw = False
        else:
            draw = False
            sx = None

        # Show save notification for 2 seconds
        if time.time() - save_message_time < 2:
            cv2.putText(img, "Gambar Disimpan!", (w // 2 - 200, h // 2), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 255, 255), 3, cv2.LINE_AA)

        cv2.imshow('Kana Practice', img)

        if cv2.waitKey(1) & 0xFF == 27:
            break

    vid.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()