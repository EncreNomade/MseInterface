<?php

include 'class.JavaScriptPacker.php';

echo "Test";

// AJAX POST check
if($_SERVER['REQUEST_METHOD'] === 'POST' && array_key_exists('script', $_POST)) {
    $script = $_POST['script'];
    $t1 = microtime(true);
    
    $packer = new JavaScriptPacker($script, 'Normal', true, false);
    $packed = $packer->pack();
    
    $t2 = microtime(true);
    $time = sprintf('%.4f', ($t2 - $t1) );
    echo '// Script ', $src, ' packed in ' , $out, ', in ', $time, ' s.', "\n";
    
    if(array_key_exists('out', $_POST)) 
        file_put_contents($_POST['out'], $packed);
    else echo $packed;
}

?>
