describe("abstract command & command manager | ", function() {
	
	var exit;
	var a_cmd ;
	
	afterEach(function() {
		CommandMgr.reset();
	});
	
	
  it("a new abstract command is ready", function() {
	a_cmd = new Command();
    expect(a_cmd.state).toBe("WAITING");
  });
  it("execute", function() {
	a_cmd = new Command();
	a_cmd.execute();
    expect(a_cmd.state).toBe("SUCCESS");
	});
	it("execute undo", function() {
	a_cmd = new Command();
	a_cmd.execute();
	a_cmd.undo();
    expect(a_cmd.state).toBe("CANCEL");
	});
	it("execute undo redo", function() {
	a_cmd = new Command();
	a_cmd.execute();
	a_cmd.undo();
	a_cmd.redo();
    expect(a_cmd.state).toBe("SUCCESS");
	});
  it("execute abstract command", function() {
	a_cmd = new Command();
	CommandMgr.executeCmd( a_cmd );
    expect(a_cmd.state).toBe("SUCCESS");
  });
  it("undo abstract command", function() {
	a_cmd = new Command();
	CommandMgr.executeCmd( a_cmd );
	CommandMgr.undoCmd( );
    expect(a_cmd.state).toBe("CANCEL");
  });
  it("redo abstract command", function() {
	a_cmd = new Command();
	CommandMgr.executeCmd( a_cmd );
	CommandMgr.undoCmd( );
	CommandMgr.reverseCmd( );
    expect(a_cmd.state).toBe("SUCCESS");
  });
  
   it("many undo redo abstract command", function() {
	a_cmd = new Command();
	CommandMgr.executeCmd( a_cmd );
	for( var k = 0 ; k < 5 ; k ++ ){
	
	  CommandMgr.undoCmd( );
	  CommandMgr.reverseCmd( );
	}
	expect(a_cmd.state).toBe("SUCCESS");
	});
  it("many undo redo abstract command", function() {
	a_cmd = new Command();
	CommandMgr.executeCmd( a_cmd );
	for( var k = 0 ; k < 5 ; k ++ ){
	
	  CommandMgr.undoCmd( );
	  CommandMgr.reverseCmd( );
	}
	CommandMgr.undoCmd( );
	expect(a_cmd.state).toBe("CANCEL");
	});
  
	
  it("fail on execute", function() {
	a_cmd = new Command();
	a_cmd.execute = function(){};
	var rep = CommandMgr.executeCmd( a_cmd );
	expect(a_cmd.state).not.toBe("SUCCESS");
	expect(rep).toBe(false);
	});
  it("fail on undo", function() {
	a_cmd = new Command();
	a_cmd.undo = function(){};
	CommandMgr.executeCmd( a_cmd );
	var rep = CommandMgr.undoCmd(  );
	expect(a_cmd.state).not.toBe("CANCEL");
	expect(rep).toBe(false);
	});
  it("fail on redo", function() {
	a_cmd = new Command();
	a_cmd.redo = function(){};
	CommandMgr.executeCmd( a_cmd );
	CommandMgr.undoCmd(  );
	var rep = CommandMgr.reverseCmd(  );
	expect(a_cmd.state).not.toBe("SUCCESS");
	expect(rep).toBe(false);
	});
});

describe("chain command & command manager | ", function() {
	
	var exit;
	var a_cmd , b_cmd , c_cmd;
	
	afterEach(function() {
		CommandMgr.reset();
	});
	beforeEach(function() {
		exit = "";
	    a_cmd = new Command();
		a_cmd.execute = function() {
			exit += "a";
	        this.state = "SUCCESS";
		}
		a_cmd.undo= function() {
				exit += "-a";
		        this.state = "CANCEL";
		}
		b_cmd = new Command();
		b_cmd.execute = function() {
			exit += "b";
	        this.state = "SUCCESS";
		}
		b_cmd.undo= function() {
				exit += "-b";
		        this.state = "CANCEL";
		}
		c_cmd = new Command();
		c_cmd.execute = function() {
			exit += "c";
	        this.state = "SUCCESS";
		}
		c_cmd.undo= function() {
				exit += "-c";
		        this.state = "CANCEL";
		}
	  });
	
  it("execute", function() {
	CommandMgr.executeCmd( a_cmd );
    expect(a_cmd.state).toBe("SUCCESS");
    expect(exit).toBe("a");
  });
  it("execute undo", function() {
	CommandMgr.executeCmd( a_cmd );
	CommandMgr.undoCmd( );
    expect(a_cmd.state).toBe("CANCEL");
    expect(exit).toBe("a-a");
  });
  it("execute undo redo", function() {
	CommandMgr.executeCmd( a_cmd );
	CommandMgr.undoCmd( );
	CommandMgr.reverseCmd( );
    expect(a_cmd.state).toBe("SUCCESS");
    expect(exit).toBe("a-aa");
  });
  it("execute many undo redo", function() {
	CommandMgr.executeCmd( a_cmd );
	for( var k = 0 ; k < 5 ; k ++ ){
		CommandMgr.undoCmd( );
		CommandMgr.reverseCmd( );
	}
    expect(a_cmd.state).toBe("SUCCESS");
    expect(exit).toBe("a-aa-aa-aa-aa-aa");
  });
  it("execute execute", function() {
	CommandMgr.executeCmd( a_cmd );
	CommandMgr.executeCmd( b_cmd );
    expect(a_cmd.state).toBe("SUCCESS");
    expect(b_cmd.state).toBe("SUCCESS");
    expect(exit).toBe("ab");
  });
  it("execute execute undo", function() {
	CommandMgr.executeCmd( a_cmd );
	CommandMgr.executeCmd( b_cmd );
	CommandMgr.undoCmd(  );
    expect(a_cmd.state).toBe("SUCCESS");
    expect(b_cmd.state).toBe("CANCEL");
    expect(exit).toBe("ab-b");
  });
  it("execute execute undo undo", function() {
	CommandMgr.executeCmd( a_cmd );
	CommandMgr.executeCmd( b_cmd );
	CommandMgr.undoCmd(  );
	CommandMgr.undoCmd(  );
    expect(a_cmd.state).toBe("CANCEL");
    expect(b_cmd.state).toBe("CANCEL");
    expect(exit).toBe("ab-b-a");
  });
  it("execute execute undo redo", function() {
	CommandMgr.executeCmd( a_cmd );
	CommandMgr.executeCmd( b_cmd );
	CommandMgr.undoCmd(  );
	CommandMgr.reverseCmd(  );
    expect(a_cmd.state).toBe("SUCCESS");
    expect(b_cmd.state).toBe("SUCCESS");
    expect(exit).toBe("ab-bb");
  });
  it("execute execute undo redo undo undo", function() {
	CommandMgr.executeCmd( a_cmd );
	CommandMgr.executeCmd( b_cmd );
	CommandMgr.undoCmd(  );
	CommandMgr.reverseCmd(  );
	CommandMgr.undoCmd(  );
	CommandMgr.undoCmd(  );
    expect(a_cmd.state).toBe("CANCEL");
    expect(b_cmd.state).toBe("CANCEL");
    expect(exit).toBe("ab-bb-b-a");
  });
  it("execute execute undo redo undo undo redo redo", function() {
	CommandMgr.executeCmd( a_cmd );
	CommandMgr.executeCmd( b_cmd );
	CommandMgr.undoCmd(  );
	CommandMgr.reverseCmd(  );
	CommandMgr.undoCmd(  );
	CommandMgr.undoCmd(  );
	CommandMgr.reverseCmd(  );
	CommandMgr.reverseCmd(  );
	expect(a_cmd.state).toBe("SUCCESS");
    expect(b_cmd.state).toBe("SUCCESS");
    expect(exit).toBe("ab-bb-b-aab");
  });
  it("execute execute undo execute", function() {
	CommandMgr.executeCmd( a_cmd );
	CommandMgr.executeCmd( b_cmd );
	CommandMgr.undoCmd(  );
	CommandMgr.executeCmd( c_cmd );
	expect(a_cmd.state).toBe("SUCCESS");
    expect(b_cmd.state).toBe("CANCEL");
    expect(c_cmd.state).toBe("SUCCESS");
    expect(exit).toBe("ab-bc");
  });
  it("execute execute undo execute redo", function() {
	CommandMgr.executeCmd( a_cmd );
	CommandMgr.executeCmd( b_cmd );
	CommandMgr.undoCmd(  );
	CommandMgr.executeCmd( c_cmd );
	var rep = CommandMgr.reverseCmd(  );
	expect(a_cmd.state).toBe("SUCCESS");
    expect(b_cmd.state).toBe("CANCEL");
    expect(c_cmd.state).toBe("SUCCESS");
    expect(exit).toBe("ab-bc");
    expect(rep).toBe(false);
  });
  it("execute execute undo execute undo undo", function() {
	CommandMgr.executeCmd( a_cmd );
	CommandMgr.executeCmd( b_cmd );
	CommandMgr.undoCmd(  );
	CommandMgr.executeCmd( c_cmd );
	CommandMgr.undoCmd(  );
	var rep = CommandMgr.undoCmd(  );
	expect(a_cmd.state).toBe("CANCEL");
    expect(b_cmd.state).toBe("CANCEL");
    expect(c_cmd.state).toBe("CANCEL");
    expect(exit).toBe("ab-bc-c-a");
    expect(rep).toBe(true);
  });
});

describe("multi command | ", function() {
	
	var exit;
	var a_cmd , b_cmd , c_cmd;
	
	afterEach(function() {
		CommandMgr.reset();
	});
	beforeEach(function() {
		exit = "";
		a_cmd=null;
		b_cmd=null;
		c_cmd=null;
	    a_cmd = new Command();
		a_cmd.execute = function() {
			exit += "a";
	        this.state = "SUCCESS";
		}
		a_cmd.undo= function() {
				exit += "-a";
		        this.state = "CANCEL";
		}
		b_cmd = new Command();
		b_cmd.execute = function() {
			exit += "b";
	        this.state = "SUCCESS";
		}
		b_cmd.undo= function() {
				exit += "-b";
		        this.state = "CANCEL";
		}
		c_cmd = new Command();
		c_cmd.execute = function() {
			exit += "c";
	        this.state = "SUCCESS";
		}
		c_cmd.undo= function() {
				exit += "-c";
		        this.state = "CANCEL";
		}
	  });
	it("instanciation arguement Array", function() {
		
		var m_cmd = new CommandMulti( [ a_cmd , b_cmd , c_cmd ] );
		
		expect(m_cmd.state).toBe("WAITING");
	    expect(m_cmd.cmds.length).toBe(3);
	});
	it("instanciation arguement commands", function() {
		
		var m_cmd = new CommandMulti(  a_cmd , b_cmd , c_cmd  );
		
		expect(m_cmd.state).toBe("WAITING");
	    expect(m_cmd.cmds.length).toBe(3);
	});
	it("execute", function() {
		
		var m_cmd = new CommandMulti(  a_cmd , b_cmd , c_cmd  );
		
		CommandMgr.executeCmd( m_cmd );
		
		expect(m_cmd.state).toBe("SUCCESS");
	    expect(exit).toBe("abc");
	});
	it("execute undo", function() {
		
		var m_cmd = new CommandMulti(  a_cmd , b_cmd , c_cmd  );
		
		CommandMgr.executeCmd( m_cmd );
		CommandMgr.undoCmd();
		expect(m_cmd.state).toBe("CANCEL");
	    expect(exit).toBe("abc-c-b-a");
	});
	it("execute undo redo", function() {
		
		var m_cmd = new CommandMulti(  a_cmd , b_cmd , c_cmd  );
		
		CommandMgr.executeCmd( m_cmd );
		CommandMgr.undoCmd();
		CommandMgr.reverseCmd();
		expect(m_cmd.state).toBe("SUCCESS");
	    expect(exit).toBe("abc-c-b-aabc");
	});
	it("execute fail first", function() {
		a_cmd.execute = function(){};
		var m_cmd = new CommandMulti(  a_cmd , b_cmd , c_cmd  );
		
		var rep = CommandMgr.executeCmd( m_cmd );
		
		expect(m_cmd.state).not.toBe("SUCCESS");
	    expect(rep).toBe(false);
	    expect(exit).toBe("");
	});
	it("execute fail middle", function() {
		b_cmd.execute = function(){};
		var m_cmd = new CommandMulti(  a_cmd , b_cmd , c_cmd  );
		
		var rep = CommandMgr.executeCmd( m_cmd );
		
		expect(m_cmd.state).not.toBe("SUCCESS");
	    expect(rep).toBe(false);
	    expect(exit).toBe("a");
	});
	it("execute fail end", function() {
		c_cmd.execute = function(){};
		var m_cmd = new CommandMulti(  a_cmd , b_cmd , c_cmd  );
		
		var rep = CommandMgr.executeCmd( m_cmd );
		
		expect(m_cmd.state).not.toBe("SUCCESS");
	    expect(rep).toBe(false);
	    expect(exit).toBe("ab");
	});
	it("undo fail end", function() {
		a_cmd.undo = function(){};
		var m_cmd = new CommandMulti(  a_cmd , b_cmd , c_cmd  );
		CommandMgr.executeCmd( m_cmd );
		var rep = CommandMgr.undoCmd();
		
		expect(m_cmd.state).not.toBe("CANCEL");
	    expect(rep).toBe(false);
	    expect(exit).toBe("abc-c-b");
	});
	it("undo fail middle", function() {
		b_cmd.undo = function(){};
		var m_cmd = new CommandMulti(  a_cmd , b_cmd , c_cmd  );
		CommandMgr.executeCmd( m_cmd );
		var rep = CommandMgr.undoCmd();
		
		expect(m_cmd.state).not.toBe("CANCEL");
	    expect(rep).toBe(false);
	    expect(exit).toBe("abc-c");
	});
	it("undo fail first", function() {
		c_cmd.undo = function(){};
		var m_cmd = new CommandMulti(  a_cmd , b_cmd , c_cmd  );
		CommandMgr.executeCmd( m_cmd );
		var rep = CommandMgr.undoCmd();
		
		expect(m_cmd.state).not.toBe("CANCEL");
	    expect(rep).toBe(false);
	    expect(exit).toBe("abc");
	});
	it("redo fail end", function() {
		c_cmd.redo = function(){};
		var m_cmd = new CommandMulti(  a_cmd , b_cmd , c_cmd  );
		CommandMgr.executeCmd( m_cmd );
		CommandMgr.undoCmd();
		var rep = CommandMgr.reverseCmd( m_cmd );
		
		expect(m_cmd.state).not.toBe("SUCCESS");
	    expect(rep).toBe(false);
	    expect(exit).toBe("abc-c-b-aab");
	});
	it("redo fail mid", function() {
		b_cmd.redo = function(){};
		var m_cmd = new CommandMulti(  a_cmd , b_cmd , c_cmd  );
		CommandMgr.executeCmd( m_cmd );
		CommandMgr.undoCmd();
		var rep = CommandMgr.reverseCmd( m_cmd );
		
		expect(m_cmd.state).not.toBe("SUCCESS");
	    expect(rep).toBe(false);
	    expect(exit).toBe("abc-c-b-aa");
	});
	it("redo fail first", function() {
		a_cmd.redo = function(){};
		var m_cmd = new CommandMulti(  a_cmd , b_cmd , c_cmd  );
		CommandMgr.executeCmd( m_cmd );
		CommandMgr.undoCmd();
		var rep = CommandMgr.reverseCmd( m_cmd );
		
		expect(m_cmd.state).not.toBe("SUCCESS");
	    expect(rep).toBe(false);
	    expect(exit).toBe("abc-c-b-a");
	});
	
});
