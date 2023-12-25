//{ Driver Code Starts
// Initial Template for C++

#include <bits/stdc++.h>
using namespace std;


// } Driver Code Ends
// User function Template for C++

class Solution {
  public:
    int numberOfEnclaves(vector<vector<int>> &grid) {
       
       queue<pair<int,int>>q;
       int n=grid.size();
       int m=grid[0].size();
       vector<vector<int>>vi(n,vector<int>(m,0));
       
      
       //top anfd bottom row;
       for(int j=0;j<m;j++){
           if(grid[0][j]==1) {
               q.push({0,j});
               vi[0][j]=1;
           }
           if(grid[n-1][j]==1) {
               q.push({n-1,j});
               vi[n-1][j]=1;
           }
       }
       
         //top anfd bottom row;
       for(int i=0;i<n;i++){
           if(grid[i][0]==1){
                q.push({i,0});
                vi[i][0]=1;
           }
           if(grid[i][m-1]==1) {
               q.push({i,m-1});
               vi[i][m-1]=1;
           }
       }
       
       //O(n+m)
       while(!q.empty()){
        int i=q.front().first;
        int j=q.front().second;
        q.pop();
                       
        int X[4]={-1,0,1,0};
        int Y[4]={0,-1,0,1};
                       
       for(int p=0;p<4;p++){
           int newx=i+X[p],newy=j+Y[p];
           if(newx>=0 && newx<n && newy>=0 && newy<m && !vi[newx][newy] && grid[newx][newy]==1 ){
               q.push({newx,newy});
               vi[newx][newy]=1;
           }
      }
       }
       
       //O(n+m);
       
       int ans=0;
       for(int i=0;i<n;i++){
           for(int j=0;j<m;j++){
               
               if(grid[i][j]==1  && !vi[i][j]){
                      ans++;
                       while(!q.empty()){
                       int i=q.front().first;
                       int j=q.front().second;
                       q.pop();
                       
                       int X[4]={-1,0,1,0};
                       int Y[4]={0,-1,0,1};
                       
                       for(int p=0;p<4;p++){
                           int newx=i+X[p],newy=j+Y[p];
                           if(newx>=0 && newx<n && newy>=0 && newy<m && !vi[newx][newy] && grid[newx][newy]==1 ){
                               q.push({newx,newy});
                               vi[newx][newy]=1;
                           }
                       }
                       
                   }
               }
           }
       }
       
      return ans;
      
    }
};


//{ Driver Code Starts.

int main() {
    int t;
    cin >> t;
    while (t--) {
        int n, m;
        cin >> n >> m;
        vector<vector<int>> grid(n, vector<int>(m));
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                cin >> grid[i][j];
            }
        }
        Solution obj;
        cout << obj.numberOfEnclaves(grid) << endl;
    }
}
// } Driver Code Ends