<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache');

$url = 'https://www.resmigazete.gov.tr/rss';

$context = stream_context_create([
    'http' => [
        'method'  => 'GET',
        'timeout' => 10,
        'header'  => "User-Agent: Mozilla/5.0 (compatible; RSSReader/1.0)\r\n"
    ]
]);

$contents = @file_get_contents($url, false, $context);

if ($contents === false) {
    http_response_code(502);
    echo json_encode(['error' => 'RSS alınamadı']);
    exit;
}

echo json_encode(['contents' => $contents]);
