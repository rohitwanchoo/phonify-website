# Campaign Dialing System

This document explains the campaign dialing workflow and implementation in the Phonify project, focusing on the `start-dialing` feature.

## Overview

The Campaign Dialing System allows agents to:
- Connect to a specific campaign
- Automatically receive and dial leads
- Manage call outcomes (dispositions)
- Perform actions during calls (SMS, Email)
- Handle call termination and redialing

## Architecture

### Components

1.  **Start Dialing Page** (`app/pages/app/start-dialing/index.vue`): The main container managing campaign state and routing.
2.  **Lead Details** (`app/components/start-dialing/lead-details/index.vue`): Displays lead information and call controls.
3.  **Disposition Dialog** (`app/components/start-dialing/lead-details/SelectDisposition.vue`): Handles call outcome submission.
4.  **SIP/Dialer Composables**:
    - `useSIPml5`: Manages WebRTC/SIP connections (call status, hangup, registration).
    - `useDialer`: Manages dialer UI state.

### File Structure

```
app/
├── pages/
│   └── app/
│       └── start-dialing/
│           └── index.vue              # Main entry point
└── components/
    └── start-dialing/
        ├── lead-details/
        │   ├── index.vue              # Lead info & Call controls
        │   └── SelectDisposition.vue  # Disposition selection dialog
        ├── send-sms/
        │   └── index.vue              # SMS tab
        └── send-email/
            └── index.vue              # Email tab
```

## Workflow

### 1. Initialization

The process begins in `app/pages/app/start-dialing/index.vue`:

1.  **Fetch Data**:
    - `GET /agent-campaign`: Loads available campaigns.
    - `GET /extension/{user_id}`: Loads extension settings (e.g., dialer mode).

2.  **Selection**:
    - Agent selects a **Campaign** and **Dialer Mode** (Desktop, Web Phone, Mobile App).
    - If `dialer_mode` changes, `POST /change-dialer-mode-extension` is called.

3.  **Start**:
    - Clicking "Submit" calls `POST /extension-login` with the `campaign_id`.
    - This logs the agent into the campaign queue.

### 2. Lead Handling

Once initiated:

1.  **Fetch Lead**: The system calls `POST /get-lead` to retrieve the next available lead.
2.  **Display**: Lead data is passed to `StartDialingLeadDetails`.
3.  **Auto-Navigation**:
    - If no lead is returned (`!lead_id`), the system resets and navigates to the default view.
    - If a lead is active, tabs (SMS, Email) are enabled.

### 3. Call Management

Inside `StartDialingLeadDetails`:

- **Active Call**: The agent interacts with the lead.
- **Hangup**:
    - Clicking "Hangup" triggers `handleHangup()`.
    - Calls `POST /hang-up` to terminate the call on the server.
    - Calls `POST /disposition_by_campaignId` to fetch valid dispositions.
    - Opens the **Disposition Dialog**.

### 4. Disposition & Completion

Inside `StartDialingLeadDetailsSelectDisposition`:

1.  **Select Outcome**: Agent chooses a disposition (e.g., "Interested", "No Answer").
2.  **Pause Option**: Agent can toggle "Pause Calling" to stop the auto-dialer after this call.
3.  **Action**:
    - **Save**:
        - Calls `POST /save-disposition`.
        - Payload includes `campaign_id`, `lead_id`, `disposition_id`, and `pause_calling` status.
        - On success, emits `save` event which triggers `refreshLeadData()` in the parent, fetching the **next lead**.
    - **Redial**:
        - Calls `POST /redial-call`.
        - Immediately dials the same lead again.

## API Integration

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/agent-campaign` | POST | Fetch list of campaigns |
| `/extension/{id}` | GET | Get extension details |
| `/extension-login` | POST | Log extension into a campaign |
| `/get-lead` | POST | Get next lead details |
| `/hang-up` | POST | Terminate current call |
| `/disposition_by_campaignId` | POST | Get dispositions for campaign |
| `/save-disposition` | POST | Submit call outcome |
| `/redial-call` | POST | Redial current lead |

## State Management

- **Route Query**: `campaign_id` is synced with the URL to persist state on refresh.
- **Lead Data**: Managed via `useLazyAsyncData` (`lead-details`), automatically refreshing when dispositions are saved.
- **Call Status**: Managed globally via `useSIPml5` (though specific implementation details are in the composable).

## Usage Example

```vue
<!-- In parent component -->
<StartDialingLeadDetails
  :lead-data="leadData"
  @refresh-lead-data="refreshLeadData"
/>

<!-- Inside StartDialingLeadDetails -->
<script setup>
async function onSaveDisposition() {
  openDisposition.value = false
  // Triggers fetching the next lead
  emits('refreshLeadData')
}
</script>
```
