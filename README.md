# Requst Client

[한국어](README.ko.md) | [Français](README.fr.md) | [简体中文](README.zh.md) | [日本語](README.ja.md) | [Español](README.es.md) | [العربية](README.ar.md) | [Tiếng Việt](README.vi.md) | [ภาษาไทย](README.th.md)

Requst Client is a powerful and intuitive web-based tool that allows you to send API requests, view responses, manage request history, and save them as collections.

## Features

### 1. Request and Response Handling

- **Request Creation**: Create API requests by selecting an HTTP method (GET, POST, PUT, DELETE, etc.) and entering the request URL.
- **Request Body**: Supports JSON formatted request bodies, with a convenient JSON formatting feature.
- **Header Management**: Add, edit, enable/disable request headers as key-value pairs.
- **Authentication**: Supports Bearer Token authentication.
- **Query Parameters**: Easily manage and enable/disable query parameters as key-value pairs.
- **Global Headers**: Set and manage global headers that are automatically applied to all requests.
- **Response Viewing**: Clearly displays response status code, status text, response time, headers, and body for your requests. The response body is automatically converted to JSON format for improved readability.

### 2. Data Management and Organization

- **Collections**: Save and manage frequently used requests as collections.
- **Grouping**: Organize requests systematically by grouping them within collections.
- **Drag and Drop**: Easily reorder requests and groups within collections using drag and drop.
- **Filtering**: Quickly search for requests in collections and history by name or URL.
- **History**: Automatically saves a record of all sent requests, allowing you to easily reload previous requests or save them to collections.
- **Data Export/Import**: Export or import all your request history, collections, global headers, and UI settings as a JSON file, making it easy to back up and restore your data.

### 3. User Interface and Settings

- **Intuitive UI**: Provides a clean and easy-to-use interface to streamline the API testing process.
- **Themes**: Personalize your user experience by choosing from various UI themes.

## Usage

### 1. Project Setup and Running

To run the project in your local environment, follow these steps:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/requst-client.git
cd requst-client

# 2. Install dependencies
npm install

# 3. Run the application
npm start
```

The application will run at `http://localhost:3000` (or another available port).

### 2. Sending API Requests

1.  **Enter URL and Method**: In the "Request" panel, enter the URL of the API you want to request and select the HTTP method (GET, POST, etc.) from the dropdown menu.
2.  **Configure Request Details**:
    - **Body**: For POST, PUT requests, enter the JSON formatted request body in the "Body" tab. Click the "Format JSON" button to format the body for better readability.
    - **Headers**: In the "Headers" tab, add necessary request headers as key-value pairs.
    - **Auth**: In the "Auth" tab, enter the Bearer Token.
    - **Query**: In the "Query" tab, add URL query parameters as key-value pairs.
    - **Global Headers**: In the "Global Headers" tab, set global headers that will be applied to all requests.
3.  **Send Request**: Click the "Send" button to send the API request.
4.  **View Response**: Check the response (status, time, headers, body) for your request in the "Response" panel.

### 3. Managing Collections and History

- **Collections**: In the "Collections" tab, you can save new requests, or edit, delete, and group existing ones. You can reorder them using drag and drop.
- **History**: In the "History" tab, view a list of previously sent requests, click to reload them into the request panel, or save them to collections.

### 4. Changing Settings

- Click the gear icon at the top of the application to open the "Settings" modal.
- **Themes**: Select your desired UI theme from the "Select Theme" dropdown.
- **Data Management**: In the "Data Management" section, click "Export Data" to back up all your data, or "Import Data" to restore previously backed up data.

---
