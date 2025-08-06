*** Settings ***
Documentation    A minimal test suite with passing and failing tests.
Library          OperatingSystem
Library          RequestsLibrary


*** Test Cases ***
Successful Test One
    [Documentation]    This test validates a string comparison.
    Log To Console    Executing a simple passing test.
    Should Be Equal As Strings    Robot Framework    Robot Framework

Successful Test Two
    [Documentation]    This test checks if a directory exists.
    Directory Should Exist    ${CURDIR}

Failing Test One
    [Documentation]    This test uses the 'Fail' keyword directly.
    Fail    This test was designed to fail intentionally.

Failing Test Two
    [Documentation]    This test has a failing assertion.
    Should Be Equal As Numbers    42    99

API Test With GET
    [Documentation]    This test makes a GET request to JSONPlaceholder API.
    ${response}=    GET    https://jsonplaceholder.typicode.com/posts/1
    Should Be Equal As Strings    ${response.status_code}    200
    Should Contain    ${response.json()}[title]    sunt

API Test With POST
    [Documentation]    This test makes a POST request and fails intentionally.
    ${data}=    Create Dictionary    title=Test Post    body=Test content    userId=1
    ${response}=    POST    https://jsonplaceholder.typicode.com/posts    json=${data}
    Should Be Equal As Strings    ${response.status_code}    201
    Should Be Equal As Numbers    ${response.json()}[id]    999

Wait Until Keyword Succeeds Test
    [Documentation]    This test uses Wait Until Keyword Succeeds and fails due to timeout.
    Wait Until Keyword Succeeds    2 seconds    0.5 seconds    Should Be Equal As Numbers    1    2
