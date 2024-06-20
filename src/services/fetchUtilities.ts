// This function creates and returns options for a fetch request.
export function makeOptions(
    method: string, // HTTP method (e.g., 'GET', 'POST')
    body: object | null, // Payload to be sent with the request, null if no body
    headers: object = {} // Additional headers to be included in the request
): RequestInit {
    // Initialize the options object with the HTTP method and default headers.
    // These headers ensure the request and response are treated as JSON.
    const options: RequestInit = {
        method: method,
        headers: {
            'Content-type': 'application/json', // Indicates the body format to be JSON
            Accept: 'application/json', // Indicates that the response should be JSON
            ...headers, // Spread any additional headers provided into the headers object
        },
    }

    // If a body is provided (not null), convert it to a JSON string and add it to the request options.
    if (body) {
        options.body = JSON.stringify(body)
    }

    // Return the fully constructed options object.
    return options
}

// This function checks the HTTP response status and handles errors or returns parsed JSON.
export async function handleHttpErrors(response: Response) {
    // If the response indicates a failure (i.e., the status code is not in the 2xx range),
    // it processes and throws an error.
    if (!response.ok) {
        // Parse the JSON from the response to get detailed error information.
        const errorResponse = await response.json()
        // Extract the message from the error response or use a default message if not available.
        const message = errorResponse.message
            ? errorResponse.message
            : 'No details provided'
        // Throw a new error with the extracted message.
        throw new Error(message)
    }
    // If the response is OK, parse and return the JSON data from the response.
    return parseJSON(response)
}

// Helper function to safely parse JSON from a response.
async function parseJSON(response: Response) {
    try {
        if (response.status === 204) return null // No content (e.g., DELETE request with no response body
        // Attempt to parse the response body as JSON.
        return await response.json()
    } catch (error) {
        // If parsing fails (e.g., if the response body is not valid JSON),
        // throw a new error indicating this issue.
        console.error('Failed to parse response', error)
        throw new Error('Failed to parse response')
    }
}
