const request = require('request')

describe('calc',()=>{
	it('testing multiple',()=>{
		expect(2*2).toBe(4)
	})
})

describe('connection',()=>{
	it('should return 200 ok',(done)=>{
		request.get('http://localhost:5000',(err,res)=>{
			expect(res.statusCode).toBe(200)
			done()
		})
	})
})