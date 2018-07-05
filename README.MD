# S3 Metadata Eventhandler

Redirect S3 Events to Sns.
Use metadata as message attributes (see filtering with sns for more information)

## Env

```properties
TOPIC_ARN=Topic where message will be redirected
MANDATORY_META_DATA=S3 metadata which must exists otherwise an error will be raised and the message will not redirected. Comma seperated
```

## Example

```yaml

ExampleRole:
    Properties:
      AssumeRolePolicyDocument:
        Statement:
          - Action:
              - sts:AssumeRole
            Effect: Allow
            Principal:
              Service:
                - lambda.amazonaws.com
      Policies:
        - PolicyDocument:
            Statement:
              - Action:
                  - s3:GetObject
                Effect: Allow
                Resource: 
                  - "*"
          PolicyName: s3Policy
        - PolicyDocument:
            Statement:
              - Action:
                  - sns:Publish
                Effect: Allow
                Resource:
                  - !Sub 'arn:aws:sns:${AWS::Region}:${AWS::AccountId}:*'
          PolicyName: snsPolicy
        - PolicyDocument:
            Statement:
              - Action:
                  - logs:CreateLogGroup
                  - logs:CreateLogStream
                  - logs:PutLogEvents
                Effect: Allow
                Resource:
                  - '*'
          PolicyName: LogPolicy
    Type: AWS::IAM::Role

ExampleTopic:
  Type: AWS::SNS::Topic
  Properties:
    DisplayName: ' exampleTopic'
    
ExampleEventHandler:
  Type: AWS::Lambda::Function
  Properties:
  Code:
    ...
  Environment:
    Variables:
      MANDATORY_META_DATA: api-key-id, pid, transcribe-provider
      TOPIC_ARN: !Ref 'ExampleTopic'
  Handler: index.handler
  Role: !GetAtt 'ExampleRole.Arn'
  Runtime: nodejs8.10
```