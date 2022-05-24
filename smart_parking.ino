#include <Servo.h>
#include <string.h>
#define SERVO_DELAY 3
#define MAX 100

int i = 0, pos = 0, servo = 3, gateOpen = 0;
Servo Myservo;
char buffer[MAX];

int state[6] = {0, 0, 0, 0, 0, 0};
int ir[6] = {2, 4, 6, 8, 10, 12};

void openGate()
{
    Myservo.write(180);
    delay(SERVO_DELAY);
    gateOpen = 1;
}

void closeGate()
{
    Myservo.write(90);
    delay(SERVO_DELAY);
    gateOpen = 0;
}

int isFull()
{
    return state[0] && state[1]; \\ To be changed
}

void setup()
{
    Serial.begin(9600);
    for (i = 0; i < 6; i++)
    {
        pinMode(ir[i], INPUT);
    }
    Myservo.attach(servo);
}

void loop()
{
    strcpy(buffer, "");

    for (i = 0; i < 6; i++)
    {
        state[i] = !digitalRead(ir[i]);
    }
    state[2] = 0;
    state[3] = 0;

    if (state[4] || (state[5] && !isFull()))
    {
        openGate();
    }
    else
    {
        closeGate();
    }
    sprintf(buffer, "{\"ir1\":\"%d\",\"ir2\":\"%d\",\"ir3\":\"%d\",\"ir4\":\"%d\",\"gate\":\"%d\"}", state[0], state[1], state[2], state[3], gateOpen);
    Serial.println(buffer);
    delay(100);
}
